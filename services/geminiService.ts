import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const explainCode = async (code: string): Promise<string> => {
  if (!aiClient) {
    return "API Key is missing. Please configure the environment variable to use AI features.";
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert senior graphics engineer specializing in CesiumJS and WebGL. 
      Briefly explain the following code snippet to a junior developer. 
      Highlight the key Cesium APIs being used and what visual result they achieve.
      Keep it under 200 words.
      
      Code:
      ${code}`,
    });
    
    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate explanation. Please try again later.";
  }
};
