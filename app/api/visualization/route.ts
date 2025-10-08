import { NextRequest, NextResponse } from "next/server";
import { getGeminiResponse } from "../../../lib/gemini";
import { validateAndSanitizeDiagram } from "../../../lib/validateDiagram";

export async function POST(req: NextRequest) {
  try {
    const { useCase, effectChain, systems } = await req.json();
  // Prompt for Gemini
  const prompt = `You are an automotive cybersecurity architect. Create an editable node-link diagram for the following vehicle function according to ISO 21434. Framework: Mermaid.\n\nRequirements:\n- The diagram must start with 'graph TD' or 'flowchart TD'.\n- Only valid Mermaid code should be returned, with no extra formatting, code blocks, or Markdown.\n- Place the code in the JSON field 'diagram'.\n\nThe data: Use Case: ${useCase}, Effect Chain: ${effectChain}, Systems: ${JSON.stringify(systems)}.`;
    const geminiRes = await getGeminiResponse(prompt);
    let { valid, sanitized, error } = validateAndSanitizeDiagram(geminiRes.diagram);
    if (valid) {
      return NextResponse.json({ success: true, diagram: sanitized });
    }
    // Try to auto-fix: send sanitized version back to Gemini for correction
    const fixPrompt = `The following Mermaid diagram is invalid: ${sanitized}. Please fix it and return only valid Mermaid code in the JSON field 'diagram'.`;
    try {
      const fixedRes = await getGeminiResponse(fixPrompt);
      let { valid: fixedValid, sanitized: fixedSanitized } = validateAndSanitizeDiagram(fixedRes.diagram);
      if (fixedValid) {
        return NextResponse.json({ success: true, diagram: fixedSanitized });
      } else {
        return NextResponse.json({ success: false, error: `Diagram invalid after AI fix: ${error}` });
      }
    } catch (fixError: any) {
      return NextResponse.json({ success: false, error: `Diagram invalid and AI fix failed: ${error}` });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
