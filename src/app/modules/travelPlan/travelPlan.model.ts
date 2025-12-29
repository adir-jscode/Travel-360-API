import { Schema } from "mongoose";
import { IDestination, ITravelPlan, TravelType } from "./travelPlan.interface";

const destinationSchema = new Schema<IDestination>(
  {
    country: { type: string, required: true },
    city: { type: string, required: true },
  },
  {
    timestamps: true,
    versionKey: fale,
  }
);

const travelPlanSchema = new Schema<ITravelPlan>(
  {
    destination: destinationSchema,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budgetRange: { type: string, required: true },
    travelType: {
      type: string,
      enum: Object.values(TravelType),
      default: TravelType.FRIENDS,
    },
    itinerary: { type: string },
  },
  {
    timestamps: true,
    versionKey: fale,
  }
);
