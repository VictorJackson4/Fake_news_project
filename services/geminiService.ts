
import { GoogleGenAI, Type } from "@google/genai";
import { PredictionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function simulateAnalysis(text: string): Promise<PredictionResult> {
  const prompt = `Analyze this news snippet for authenticity.
  Text: "${text}"
  
  Tasks:
  1. Classify as REAL or FAKE.
  2. Estimate a confidence probability (0.0 to 1.0).
  3. Identify 5-8 key words and assign a "SHAP impact" value. 
     - Positive values push towards REAL.
     - Negative values push towards FAKE.
  
  Return ONLY a JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, enum: ["REAL", "FAKE"] },
            confidence: { type: Type.NUMBER },
            explanation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  impact: { type: Type.NUMBER }
                },
                required: ["word", "impact"]
              }
            }
          },
          required: ["label", "confidence", "explanation"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as PredictionResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    // Fallback mock
    return {
      label: 'FAKE',
      confidence: 0.85,
      explanation: [
        { word: "shocking", impact: -0.4 },
        { word: "secret", impact: -0.3 },
        { word: "government", impact: 0.1 }
      ]
    };
  }
}
