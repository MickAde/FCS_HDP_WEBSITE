
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export const generatePracticeQuestions = async (subject: string, difficulty: string = "freshman"): Promise<Question[]> => {
  // Always use process.env.API_KEY directly when initializing GoogleGenAI
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Generate 5 multiple-choice practice questions for a ${difficulty} level student on the subject of ${subject}. 
    Provide the response in JSON format. Each question should have a text, four options, an index for the correct answer (0-3), and a brief explanation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "text", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    // Access response.text property directly and trim it as recommended to handle JSON strings properly
    const text = response.text;
    const questions = JSON.parse(text ? text.trim() : "[]");
    return questions;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return [];
  }
};
