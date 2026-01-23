import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, sessionId } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    // Initialize Gemini client
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // Generate content
    const result = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    return res.status(200).json({
      text: result.text,
      sessionId,
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return res.status(500).json({
      error: "Quantum AI Core unavailable",
    });
  }
}
