import { NextRequest, NextResponse } from "next/server";
import { getGeminiResponse } from "../../../lib/gemini";
import { validateThreatModel } from "../../../lib/validateThreatModel";

export async function POST(req: NextRequest) {
  try {
    const { useCase, effectChain, systems, diagram } = await req.json();
  // Prompt for Gemini
  const prompt = `Perform a STRIDE threat modeling analysis according to ISO 21434 for the following vehicle function. Use Case: ${useCase}, Effect Chain: ${effectChain}, Systems: ${JSON.stringify(systems)}, Diagram: ${diagram}. Return the results as a JSON array with the fields asset, property, stride, reasoning, damage. Categorize damage as Safety, Operational, Privacy, or Financial. Respond exclusively with raw JSON without any formatting, code blocks, or markdown.`;
    const geminiRes = await getGeminiResponse(prompt);
    // Accept both { results: [...] } and [...] formats
    let results = Array.isArray(geminiRes) ? geminiRes : geminiRes.results;
    if (!validateThreatModel(results)) {
      return NextResponse.json({ success: false, error: "Invalid result format" });
    }
    return NextResponse.json({ success: true, results });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
