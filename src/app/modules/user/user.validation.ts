import z from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string({ error: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password: z
    .string({ error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
  phone: z
    .string({ error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  currentLocation: z
    .string({ error: "current Location must be string" })
    .min(2, { message: "current Location must be at least 2 characters long." })
    .max(50, { message: "current Location cannot exceed 50 characters." })
    .optional(),
});

// name, phone,picture,bio,travelInterest,visitedCountries,currentLocation
export const updateUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  picture: z.string({ error: "Picture must be string" }).optional(),
  bio: z.string({ error: "Bio must be string" }).optional(),
  travelInterest: z
    .array(z.string({ error: "Each interest must be a valid string" }))
    .max(5, { error: "You can add maximum 5 Travel Interests" })
    .optional(),
  visitedCountries: z
    .array(z.string({ error: "Each interest must be a valid string" }))
    .optional(),
  password: z
    .string({ error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    })
    .optional(),
  phone: z
    .string({ error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  currentLocation: z
    .string({ error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
});
export const giveRatingZodSchema = z.object({
  value: z
    .int("Value must be a positive number")
    .min(1, { message: "Rating value must be 1" })
    .max(5, { message: "Rating can't be bigger than 5" }),
});
export const giveReviewZodSchema = z.object({
  description: z.string({ error: "Description must be string" }),
});
