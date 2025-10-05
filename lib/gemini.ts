// @ts-ignore: No types available for @google/generative-ai
import { GoogleGenerativeAI } from "@google/generative-ai";

// Next.js API routes run server-side, so process.env is safe for secrets
const apiKey = process.env.GEMINI_API_KEY;

export async function getGeminiResponse(prompt: string): Promise<any> {
  if (!apiKey) {
    throw new Error("Gemini API Key fehlt. Bitte .env konfigurieren.");
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use Gemini 1.5 Pro, or adjust model as needed
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    // Clean up Markdown code fences if present
    let text = response.text();
    text = text.replace(/^```json\s*|```$/gim, "").trim();
    // Also remove any generic code fences
    text = text.replace(/^```[a-zA-Z]*\s*|```$/gim, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      throw new Error("Gemini API returned ungültiges JSON: " + text);
    }
    return parsed;
  } catch (err: any) {
    throw new Error("Gemini API Fehler: " + (err?.message || err));
  }
}
