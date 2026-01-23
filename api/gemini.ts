import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

// Server-side only Gemini client
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY!);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, mfaVerified, sessionId } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    // Optional: enforce MFA-sensitive actions
    if (!mfaVerified && /over\s+\$?\d+/i.test(prompt)) {
      return res.status(200).json({
        text: JSON.stringify({
          response:
            "This request requires identity verification before execution.",
          update: null,
          action: "MFA_TRIGGER",
        }),
        sessionId,
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

    const result = await model.generateContent(prompt);

    return res.status(200).json({
      text: result.response.text(),
      sessionId,
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return res.status(500).json({
      error: "Quantum AI Core unavailable",
    });
  }
}
