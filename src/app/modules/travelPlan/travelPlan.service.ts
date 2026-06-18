import { groq } from "../../config/groq.config";
import AppError from "../../errorHelpers/AppError";
import { ITravelPlan, TravelType, Visibility } from "./travelPlan.interface";
import { TravelPlan } from "./travelPlan.model";

const generateTravelPlan = async (
  userId: string,
  payload: Partial<ITravelPlan>,
) => {
  const { destination, days } = payload;

  if (!destination || !days) {
    throw new AppError(400, "Destination and days are required");
  }

  try {
    const prompt = `
You are an expert travel planner.

Generate a realistic ${days}-day travel itinerary.

Country: ${destination?.country}
City: ${destination?.city}

Return ONLY valid JSON.

{
  "budgetMin": number,
  "budgetMax": number,
  "itinerary": [
    {
      "day": number,
      "title": string,
      "activities": [string]
    }
  ]
}

Rules:
- itinerary length must equal ${days}
- budget values should be realistic in USD
- each day must contain 3-5 activities
- no markdown
- no explanation
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel planner. Always return valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
      throw new AppError(400, "Failed to generate travel plan");
    }

    const parsedData = JSON.parse(text);

    if (!parsedData.itinerary || !Array.isArray(parsedData.itinerary)) {
      throw new AppError(400, "Invalid itinerary generated");
    }

    const startDate = new Date();

    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

    const travelPlan = await TravelPlan.create({
      user: userId,

      destination: {
        city: destination.city,
        country: destination.country,
      },

      days,

      startDate,
      endDate,

      budgetMin: parsedData.budgetMin,
      budgetMax: parsedData.budgetMax,

      travelType: TravelType.SOLO,

      visibility: Visibility.PUBLIC,

      itinerary: parsedData.itinerary,
    });

    return travelPlan;
  } catch (error) {
    console.error("AI Travel Plan Error:", error);

    throw new AppError(500, "Failed to generate travel plan");
  }
};

//create travel plan by user
const createTravelPlan = async (
  userId: string,
  payload: Partial<ITravelPlan>,
) => {
  const travelPlan = await TravelPlan.create({
    ...payload,
    user: userId,
  });

  return travelPlan;
};
// update travel plan
const updateTravelPlan = async (
  userId: string,
  planId: string,
  payload: Partial<ITravelPlan>,
) => {
  const travelPlan = await TravelPlan.findOne({
    _id: planId,
    user: userId,
  });

  if (!travelPlan) {
    throw new AppError(404, "Travel plan not found");
  }

  const updatedPlan = await TravelPlan.findByIdAndUpdate(planId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedPlan;
};
// delete travel plan
const deleteTravelPlan = async (userId: string, planId: string) => {
  const travelPlan = await TravelPlan.findOne({
    _id: planId,
    user: userId,
  });

  if (!travelPlan) {
    throw new AppError(404, "Travel plan not found");
  }

  await TravelPlan.findByIdAndDelete(planId);

  return null;
};
//toggle visibility of plan
const toggleVisibility = async (userId: string, planId: string) => {
  const travelPlan = await TravelPlan.findOne({
    _id: planId,
    user: userId,
  });

  if (!travelPlan) {
    throw new AppError(404, "Travel plan not found");
  }

  const visibility =
    travelPlan.visibility === Visibility.PUBLIC
      ? Visibility.PRIVATE
      : Visibility.PUBLIC;

  const updatedPlan = await TravelPlan.findByIdAndUpdate(
    planId,
    { visibility },
    { new: true },
  );

  return updatedPlan;
};

export const TravelPlanServices = {
  generateTravelPlan,
  createTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
  toggleVisibility,
};
