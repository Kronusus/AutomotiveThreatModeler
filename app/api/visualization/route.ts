import { NextRequest, NextResponse } from "next/server";
import { getGeminiResponse } from "../../../lib/gemini";
import { validateDiagram } from "../../../lib/validateDiagram";

export async function POST(req: NextRequest) {
  try {
    const { useCase, effectChain, systems } = await req.json();
    // Prompt für Gemini
    const prompt = `Du bist ein Automotive Cybersecurity Architekt. Erstelle ein editierbares Node-Link-Diagramm für folgende Fahrzeugfunktion nach ISO 21434. Framework: Mermaid. Die Daten: Use Case: ${useCase}, Effektkette: ${effectChain}, Systeme: ${JSON.stringify(systems)}. Gib das Diagramm als gültigen Mermaid-Code im JSON-Feld 'diagram' zurück.`;
    const geminiRes = await getGeminiResponse(prompt);
    if (!validateDiagram(geminiRes.diagram)) {
      return NextResponse.json({ success: false, error: "Ungültiges Diagrammformat" });
    }
    return NextResponse.json({ success: true, diagram: geminiRes.diagram });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
