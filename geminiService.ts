
import { GoogleGenAI, Type } from "@google/genai";
import { ScoreEntry, PerformanceAnalysis } from './types';

// Initialize with API key from environment - must be set for Gemini features to work
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Debug logging
console.log("Gemini API Key loaded:", apiKey ? '✓ Successfully configured' : '✗ Not configured - set VITE_GEMINI_API_KEY in .env.local');
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export async function analyzePerformance(scores: ScoreEntry[], studentName: string): Promise<PerformanceAnalysis> {
  if (!ai) {
    console.warn("Gemini API Key not configured. Set VITE_GEMINI_API_KEY in .env.local to enable AI analysis.");
    return {
      summary: "Technical evaluation pending API configuration.",
      recommendations: ["Set GOOGLE_API_KEY environment variable", "Configure Gemini API access"],
      careerPath: "General Engineering Practice"
    };
  }

  const prompt = `
    Analyze the academic engineering performance of ${studentName}.
    Scores: ${JSON.stringify(scores)}
    
    Evaluate technical proficiency in Lab work vs Theory. 
    Predict a potential career specialization (e.g. System Design, R&D, Operations).
    Provide a professional, technical summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Technical performance overview" },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable engineering skills to improve"
            },
            careerPath: { type: Type.STRING, description: "Likely engineering specialization" }
          },
          required: ["summary", "recommendations", "careerPath"]
        }
      }
    });

    // Extract the actual content from the response
    const content = response.candidates?.[0]?.content?.parts?.[0]?.text || response.text;
    return JSON.parse(content);
  } catch (error: any) {
    // If quota/rate-limit error, warn succinctly and return fallback without dumping full error
    const quotaExceeded = error?.error?.code === 429 || error?.status === 'RESOURCE_EXHAUSTED' || (error?.message || '').toLowerCase().includes('quota');
    if (quotaExceeded) {
      console.warn('Gemini quota exceeded or rate-limited. Returning fallback analysis. Check billing/quotas in Google Cloud Console.');
    } else {
      console.error('Gemini API analysis failed:', error?.message || error);
    }

    // Return fallback data instead of showing error
    return {
      summary: "AI analysis unavailable at this moment. Your performance shows solid progress across subjects. Continue focusing on practical lab applications to strengthen fundamental skills.",
      recommendations: ["Master core concepts through hands-on practice", "Participate actively in lab sessions", "Review theory before lab experiments", "Seek clarification on difficult topics"],
      careerPath: "Software Engineering / Systems Design"
    };
  }
}
