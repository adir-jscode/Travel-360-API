import { Types } from "mongoose";

export interface IDestination {
  country: string;
  city: string;
}

export enum TravelType {
  SOLO = "SOLO",
  FAMILY = "FAMILY",
  FRIENDS = "FRIENDS",
}
export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export interface ITravelPlan {
  user: Types.ObjectId;
  destination: IDestination;
  startDate: Date;
  endDate: Date;
  budgetMin: number;
  budgetMax: number;
  travelType: TravelType;
  itinerary?: string;
  visibility: Visibility;
}
