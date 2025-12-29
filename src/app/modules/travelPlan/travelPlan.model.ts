import { model, Schema } from "mongoose";
import { IDestination, ITravelPlan, TravelType } from "./travelPlan.interface";

const destinationSchema = new Schema<IDestination>(
  {
    country: { type: String, required: true },
    city: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const travelPlanSchema = new Schema<ITravelPlan>(
  {
    destination: destinationSchema,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    travelType: {
      type: String,
      enum: Object.values(TravelType),
      default: TravelType.FRIENDS,
    },
    itinerary: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TravelPlan = model<ITravelPlan>("TravelPlan", travelPlanSchema);
