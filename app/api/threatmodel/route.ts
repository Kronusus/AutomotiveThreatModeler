import { NextRequest, NextResponse } from "next/server";
import { getGeminiResponse } from "../../../lib/gemini";
import { validateThreatModel } from "../../../lib/validateThreatModel";

export async function POST(req: NextRequest) {
  try {
    const { useCase, effectChain, systems, diagram } = await req.json();
    // Prompt für Gemini
    const prompt = `Führe eine STRIDE Threat Modeling Analyse nach ISO 21434 für folgende Fahrzeugfunktion durch. Use Case: ${useCase}, Effektkette: ${effectChain}, Systeme: ${JSON.stringify(systems)}, Diagramm: ${diagram}. Gib die Ergebnisse als JSON-Array mit Feldern asset, property, stride, reasoning, damage zurück. Kategorisiere damage als Safety, Operational, Privacy oder Financial.`;
    const geminiRes = await getGeminiResponse(prompt);
    if (!validateThreatModel(geminiRes.results)) {
      return NextResponse.json({ success: false, error: "Ungültiges Ergebnisformat" });
    }
    return NextResponse.json({ success: true, results: geminiRes.results });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
