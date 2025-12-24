export interface IDestination {
  country: string;
  city: string;
}

export enum TravelType {
  SOLO = "SOLO",
  FAMILY = "FAMILY",
  FRIENDS = "FRIENDS",
}

export interface ITravelPlan {
  destination: IDestination;
  startDate: date;
  endDate: date;
  budgetRange: string;
  travelType: TravelType;
  itinerary?: string;
}
