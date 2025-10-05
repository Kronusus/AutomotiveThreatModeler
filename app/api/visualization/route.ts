import { NextRequest, NextResponse } from "next/server";
import { getGeminiResponse } from "../../../lib/gemini";
import { validateDiagram } from "../../../lib/validateDiagram";

export async function POST(req: NextRequest) {
  try {
    const { useCase, effectChain, systems } = await req.json();
    // Prompt for Gemini
    const prompt = `You are an automotive cybersecurity architect. Create an editable node-link diagram for the following vehicle function according to ISO 21434. Framework: Mermaid. The data: Use Case: ${useCase}, Effect Chain: ${effectChain}, Systems: ${JSON.stringify(systems)}. Return the diagram as valid Mermaid code in the JSON field 'diagram'. Respond exclusively with raw JSON without any formatting, code blocks, or Markdown.`;
    const geminiRes = await getGeminiResponse(prompt);
    if (!validateDiagram(geminiRes.diagram)) {
      return NextResponse.json({ success: false, error: "Invalid diagram format" });
    }
    return NextResponse.json({ success: true, diagram: geminiRes.diagram });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
