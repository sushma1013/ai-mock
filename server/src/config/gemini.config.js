import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
];

const generateContent = async (prompt) => {
  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      console.log(`Gemini success: ${model}`);

      return response.text;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini ${model} failed:`,
        error.message
      );
    }
  }

  throw new Error(
    `All Gemini models failed: ${lastError?.message || "Unknown Gemini error"}`
  );
};

export { generateContent };