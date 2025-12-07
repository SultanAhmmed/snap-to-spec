import { GoogleGenAI, Type } from "@google/genai";
import { RepairGuideData } from "../types";

// Initialize Gemini Client
// We assume process.env.API_KEY is available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert repair technician and DIY specialist. 
Your task is to analyze images of broken household items, electronics, or parts.
1. Identify the object, brand, and potential model.
2. Analyze the visible damage or describe the likely error based on visual cues.
3. Provide a structured, step-by-step repair guide.
4. Estimate difficulty, time, and tools needed.
5. Emphasize safety. If the repair involves electricity, sharp objects, or specific hazards, explicitly list them in safetyWarnings.

Return the response strictly as a valid JSON object matching the requested schema.
`;

export const analyzeImageForRepair = async (base64Image: string): Promise<RepairGuideData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity from client
              data: base64Image,
            },
          },
          {
            text: "Analyze this image. Identify the item, diagnose the issue, and provide a repair guide.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING, description: "Name of the item identified" },
            modelNumber: { type: Type.STRING, description: "Specific model number if visible or inferred", nullable: true },
            damageAnalysis: { type: Type.STRING, description: "Description of the visual damage or diagnosis" },
            difficultyLevel: { 
              type: Type.STRING, 
              enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
              description: "Estimated difficulty level"
            },
            toolsRequired: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of tools needed for the repair"
            },
            estimatedTime: { type: Type.STRING, description: "Estimated time to complete repair (e.g. '30-45 mins')" },
            safetyWarnings: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Critical safety warnings, especially involving electricity or sharp objects"
            },
            repairSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  action: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["stepNumber", "action", "explanation"]
              }
            }
          },
          required: ["itemName", "damageAnalysis", "difficultyLevel", "toolsRequired", "estimatedTime", "repairSteps", "safetyWarnings"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    const data = JSON.parse(response.text) as RepairGuideData;
    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
};