"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelPlanServices = void 0;
const groq_config_1 = require("../../config/groq.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const travelPlan_interface_1 = require("./travelPlan.interface");
const travelPlan_model_1 = require("./travelPlan.model");
const generateTravelPlan = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // const planCount = await TravelPlan.countDocuments({
    //   user: userId,
    // });
    // const user = await User.findById(userId);
    // if (!user?.subscription?.isActive && planCount >= 1) {
    //   throw new AppError(
    //     403,
    //     "Free users can generate only 1 travel plans using AI",
    //   );
    // }
    const { destination, days } = payload;
    if (!destination || !days) {
        throw new AppError_1.default(400, "Destination and days are required");
    }
    try {
        const prompt = `
You are an expert travel planner.

Generate a realistic ${days}-day travel itinerary.

Country: ${destination === null || destination === void 0 ? void 0 : destination.country}
City: ${destination === null || destination === void 0 ? void 0 : destination.city}

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
        const response = yield groq_config_1.groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an expert travel planner. Always return valid JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.5,
        });
        const text = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        if (!text) {
            throw new AppError_1.default(400, "Failed to generate travel plan");
        }
        const parsedData = JSON.parse(text);
        if (!parsedData.itinerary || !Array.isArray(parsedData.itinerary)) {
            throw new AppError_1.default(400, "Invalid itinerary generated");
        }
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
        const travelPlan = yield travelPlan_model_1.TravelPlan.create({
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
            travelType: travelPlan_interface_1.TravelType.SOLO,
            visibility: travelPlan_interface_1.Visibility.PUBLIC,
            itinerary: parsedData.itinerary,
        });
        return travelPlan;
    }
    catch (error) {
        console.error("AI Travel Plan Error:", error);
        throw new AppError_1.default(500, "Failed to generate travel plan");
    }
});
//create travel plan by user
const createTravelPlan = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //
    console.log({ payload });
    const travelPlan = yield travelPlan_model_1.TravelPlan.create(Object.assign(Object.assign({}, payload), { user: userId }));
    return travelPlan;
});
// update travel plan
const updateTravelPlan = (userId, planId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ planId, userId });
    // const travelPlan = await TravelPlan.findOne({
    //   _id: planId,
    //   user: userId,
    // });
    // if (!travelPlan) {
    //   throw new AppError(404, "Travel plan not found");
    // }
    const updatedPlan = yield travelPlan_model_1.TravelPlan.findByIdAndUpdate(planId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedPlan;
});
// delete travel plan
const deleteTravelPlan = (userId, planId) => __awaiter(void 0, void 0, void 0, function* () {
    const travelPlan = yield travelPlan_model_1.TravelPlan.findOne({
        _id: planId,
        user: userId,
    });
    if (!travelPlan) {
        throw new AppError_1.default(404, "Travel plan not found");
    }
    yield travelPlan_model_1.TravelPlan.findByIdAndDelete(planId);
    return null;
});
//toggle visibility of plan
const toggleVisibility = (userId, planId) => __awaiter(void 0, void 0, void 0, function* () {
    const travelPlan = yield travelPlan_model_1.TravelPlan.findOne({
        _id: planId,
        user: userId,
    });
    if (!travelPlan) {
        throw new AppError_1.default(404, "Travel plan not found");
    }
    const visibility = travelPlan.visibility === travelPlan_interface_1.Visibility.PUBLIC
        ? travelPlan_interface_1.Visibility.PRIVATE
        : travelPlan_interface_1.Visibility.PUBLIC;
    const updatedPlan = yield travelPlan_model_1.TravelPlan.findByIdAndUpdate(planId, { visibility }, { new: true });
    return updatedPlan;
});
// search travelPlan by destination,startDate,endDate
const getAllTravelPlans = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { country, city, startDate, endDate } = query;
    console.log(query);
    const filter = {
        visibility: travelPlan_interface_1.Visibility.PUBLIC,
    };
    if (country) {
        filter["destination.country"] = {
            $regex: country,
            $options: "i",
        };
    }
    if (city) {
        filter["destination.city"] = {
            $regex: city,
            $options: "i",
        };
    }
    if (startDate || endDate) {
        filter.startDate = {};
        if (startDate) {
            filter.startDate = Object.assign(Object.assign({}, filter.startDate), { $gte: new Date(startDate) });
        }
        if (endDate) {
            filter.startDate = Object.assign(Object.assign({}, filter.startDate), { $lte: new Date(endDate) });
        }
    }
    const result = yield travelPlan_model_1.TravelPlan.find(filter)
        .populate("user", "name")
        .sort({ createdAt: -1 });
    return result;
});
const getTravelPlansById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield travelPlan_model_1.TravelPlan.findById(id)
        .populate("user", "name")
        .sort({ createdAt: -1 });
    return result;
});
const getMyTravelPlans = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { country, city, startDate, endDate, visibility } = query;
    const filter = {
        user: userId,
    };
    // Optional visibility filter
    if (visibility) {
        filter.visibility = visibility;
    }
    // Destination country
    if (country) {
        filter["destination.country"] = {
            $regex: country,
            $options: "i",
        };
    }
    // Destination city
    if (city) {
        filter["destination.city"] = {
            $regex: city,
            $options: "i",
        };
    }
    // Date range
    if (startDate || endDate) {
        filter.startDate = {};
        if (startDate) {
            filter.startDate.$gte = new Date(startDate);
        }
        if (endDate) {
            filter.startDate.$lte = new Date(endDate);
        }
    }
    const result = yield travelPlan_model_1.TravelPlan.find(filter)
        .populate("user", "name picture email")
        .sort({ createdAt: -1 });
    return result;
});
exports.TravelPlanServices = {
    generateTravelPlan,
    createTravelPlan,
    updateTravelPlan,
    deleteTravelPlan,
    toggleVisibility,
    getAllTravelPlans,
    getTravelPlansById,
    getMyTravelPlans,
};
