import mongoose, { model } from "mongoose";
import { ITravelPlan, TravelType, Visibility } from "./travelPlan.interface";

const travelPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    destination: {
      city: { type: String },
      country: String,
    },
    days: Number,
    startDate: Date,
    endDate: Date,
    budgetMin: Number,
    budgetMax: Number,
    travelType: {
      type: String,
      enum: Object.values(TravelType),
      default: TravelType.SOLO,
    },
    itinerary: [
      {
        day: Number,
        title: String,
        activities: [String],
      },
    ],
    visibility: {
      type: String,
      enum: Object.values(Visibility),
      default: Visibility.PUBLIC,
    },
  },
  { timestamps: true, versionKey: false },
);

export const TravelPlan = model<ITravelPlan>("TravelPlan", travelPlanSchema);
