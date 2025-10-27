import { GoogleGenerativeAI } from "@google/generative-ai";

// Next.js API routes run server-side, so process.env is safe for secrets
const GEMINI_ENV_NAME = "GEMINI_API_KEY" as const;
const rawApiKey = process.env[GEMINI_ENV_NAME]?.trim();
const GEMINI_KEY_PATTERN = /^AI[0-9A-Za-z_-]{20,}$/;

const hasApiKey = Boolean(rawApiKey);
const isApiKeyLikelyValid = hasApiKey ? GEMINI_KEY_PATTERN.test(rawApiKey!) : false;

if (!hasApiKey) {
  console.error(
    `[Gemini] Missing ${GEMINI_ENV_NAME}. Add it to your environment (e.g., .env.local) before running analyses.`
  );
} else if (!isApiKeyLikelyValid) {
  console.warn(
    `[Gemini] ${GEMINI_ENV_NAME} is present but does not match the expected format (should resemble Google API keys starting with "AI..."). Requests may fail.`
  );
}

const apiKey = rawApiKey;

export async function getGeminiResponse(prompt: string): Promise<any> {
  if (!apiKey) {
    throw new Error(
      "Gemini API key missing. Set GEMINI_API_KEY in your environment configuration and restart the app."
    );
  }

  if (!isApiKeyLikelyValid) {
    throw new Error(
      "Gemini API key appears invalid. Verify the GEMINI_API_KEY value (it should resemble Google API keys starting with 'AI...')."
    );
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
      throw new Error("Gemini API returned invalid JSON: " + text);
    }
    return parsed;
  } catch (err: any) {
    throw new Error("Gemini API Fehler: " + (err?.message || err));
  }
}
