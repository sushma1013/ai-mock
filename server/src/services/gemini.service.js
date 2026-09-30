import { generateContent } from "../config/gemini.config.js";

export const askGemini = async (prompt) => {
  try {
    return await generateContent(prompt);
  } catch (error) {
    console.error("Gemini Service Error:", error.message);

    throw new Error(
      "The AI service is currently unavailable. Please try again later."
    );
  }
};