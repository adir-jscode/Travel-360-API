import { ai } from "../../config/gemini.config";
import AppError from "../../errorHelpers/AppError";

const generateTravelPlan = async (destination: string, days: number) => {
  try {
    const prompt = `
    Create a detailed ${days}-day travel plan for ${destination}.

    Return ONLY valid JSON in this structure:

    {
      "title": "",
      "description": "",
      "highlights": [
        { "title": "", "description": "" }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "",
          "activities": []
        }
      ]
    }
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    let text = response.text;
    if (!text) {
      throw new AppError(400, "Failed to generate travel plan");
    }
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(text);
    console.log(parsedData);

    return parsedData;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new AppError(500, "AI generation failed");
  }
};

export const TravelPlanServices = { generateTravelPlan };
