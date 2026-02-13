import mongoose from "mongoose";

const travelPlanSchema = new mongoose.Schema(
  {
    destination: String,
    days: Number,
    slug: { type: String, unique: true },

    title: String,
    description: String,

    highlights: [
      {
        title: String,
        description: String,
      },
    ],

    itinerary: [
      {
        day: Number,
        title: String,
        activities: [String],
      },
    ],

    images: {
      hero: String,
      gallery: [String],
    },

    meta: {
      metaTitle: String,
      metaDescription: String,
      metaImage: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TravelPlan", travelPlanSchema);
