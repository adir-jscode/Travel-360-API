"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAiTravelPlanZodSchema = exports.updateTravelPlanZodSchema = exports.createTravelPlanZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const travelPlan_interface_1 = require("./travelPlan.interface");
/* ---------------------------------- */
/* Reusable sub-schemas                */
/* ---------------------------------- */
const destinationSchema = zod_1.default.object({
    country: zod_1.default.string().min(1, "Country is required").optional(),
    city: zod_1.default.string().min(1).optional(),
});
const itinerarySchema = zod_1.default.object({
    day: zod_1.default.number().int().positive("Day must be a positive integer"),
    title: zod_1.default.string().min(1, "Title is required"),
    activities: zod_1.default
        .array(zod_1.default.string().min(1))
        .min(1, "At least one activity is required"),
});
/* ---------------------------------- */
/* CREATE Travel Plan Schema           */
/* ---------------------------------- */
exports.createTravelPlanZodSchema = zod_1.default
    .object({
    destination: destinationSchema,
    days: zod_1.default.number().int().positive("Days must be a positive number"),
    startDate: zod_1.default.coerce.date({
        error: "Start date is required",
    }),
    endDate: zod_1.default.coerce.date({
        error: "End date is required",
    }),
    budgetMin: zod_1.default.number().nonnegative("Minimum budget must be ≥ 0"),
    budgetMax: zod_1.default.number().nonnegative("Maximum budget must be ≥ 0"),
    travelType: zod_1.default.enum(travelPlan_interface_1.TravelType).default(travelPlan_interface_1.TravelType.SOLO),
    itinerary: zod_1.default.array(itinerarySchema).optional(),
    visibility: zod_1.default.enum(travelPlan_interface_1.Visibility).default(travelPlan_interface_1.Visibility.PUBLIC),
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
exports.updateTravelPlanZodSchema = zod_1.default
    .object({
    destination: destinationSchema.optional(),
    days: zod_1.default.number().int().positive().optional(),
    startDate: zod_1.default.coerce.date().optional(),
    endDate: zod_1.default.coerce.date().optional(),
    budgetMin: zod_1.default.number().nonnegative().optional(),
    budgetMax: zod_1.default.number().nonnegative().optional(),
    travelType: zod_1.default.enum(travelPlan_interface_1.TravelType).optional(),
    itinerary: zod_1.default.array(itinerarySchema).optional(),
    visibility: zod_1.default.enum(travelPlan_interface_1.Visibility).optional(),
})
    .refine((data) => data.budgetMin === undefined ||
    data.budgetMax === undefined ||
    data.budgetMax >= data.budgetMin, {
    message: "budgetMax must be greater than or equal to budgetMin",
    path: ["budgetMax"],
})
    .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
});
exports.createAiTravelPlanZodSchema = zod_1.default.object({
    destination: destinationSchema,
    days: zod_1.default.number().int().positive("Days must be a positive number"),
    startDate: zod_1.default.coerce.date({
        error: "Start date is required",
    }),
    endDate: zod_1.default.coerce.date({
        error: "End date is required",
    }),
    travelType: zod_1.default.enum(travelPlan_interface_1.TravelType).default(travelPlan_interface_1.TravelType.SOLO),
    visibility: zod_1.default.enum(travelPlan_interface_1.Visibility).default(travelPlan_interface_1.Visibility.PUBLIC),
});
