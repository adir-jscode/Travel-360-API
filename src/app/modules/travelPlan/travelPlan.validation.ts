import z from "zod";
import { TravelType, Visibility } from "./travelPlan.interface";

/* ---------------------------------- */
/* Reusable sub-schemas                */
/* ---------------------------------- */

const destinationSchema = z.object({
  country: z.string().min(1, "Country is required").optional(),
  city: z.string().min(1).optional(),
});

const itinerarySchema = z.object({
  day: z.number().int().positive("Day must be a positive integer"),
  title: z.string().min(1, "Title is required"),
  activities: z
    .array(z.string().min(1))
    .min(1, "At least one activity is required"),
});

/* ---------------------------------- */
/* CREATE Travel Plan Schema           */
/* ---------------------------------- */

export const createTravelPlanZodSchema = z
  .object({
    destination: destinationSchema,

    days: z.number().int().positive("Days must be a positive number"),

    startDate: z.coerce.date({
      error: "Start date is required",
    }),

    endDate: z.coerce.date({
      error: "End date is required",
    }),

    budgetMin: z.number().nonnegative("Minimum budget must be ≥ 0"),

    budgetMax: z.number().nonnegative("Maximum budget must be ≥ 0"),

    travelType: z.enum(TravelType).default(TravelType.SOLO),

    itinerary: z.array(itinerarySchema).optional(),

    visibility: z.enum(Visibility).default(Visibility.PUBLIC),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "budgetMax must be greater than or equal to budgetMin",
    path: ["budgetMax"],
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

/* ---------------------------------- */
/* UPDATE Travel Plan Schema           */
/* ---------------------------------- */

export const updateTravelPlanZodSchema = z
  .object({
    destination: destinationSchema.optional(),

    days: z.number().int().positive().optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    budgetMin: z.number().nonnegative().optional(),

    budgetMax: z.number().nonnegative().optional(),

    travelType: z.enum(TravelType).optional(),

    itinerary: z.array(itinerarySchema).optional(),

    visibility: z.enum(Visibility).optional(),
  })
  .refine(
    (data) =>
      data.budgetMin === undefined ||
      data.budgetMax === undefined ||
      data.budgetMax >= data.budgetMin,
    {
      message: "budgetMax must be greater than or equal to budgetMin",
      path: ["budgetMax"],
    },
  )
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: "endDate must be after startDate",
      path: ["endDate"],
    },
  );

export const createAiTravelPlanZodSchema = z.object({
  destination: destinationSchema,

  days: z.number().int().positive("Days must be a positive number"),

  startDate: z.coerce.date({
    error: "Start date is required",
  }),

  endDate: z.coerce.date({
    error: "End date is required",
  }),
  travelType: z.enum(TravelType).default(TravelType.SOLO),
  visibility: z.enum(Visibility).default(Visibility.PUBLIC),
});
