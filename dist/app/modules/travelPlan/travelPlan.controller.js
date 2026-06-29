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
exports.travelPlanControllers = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const travelPlan_service_1 = require("./travelPlan.service");
const generateTravelPlan = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    console.log(userId);
    if (!userId) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const aiPlan = yield travelPlan_service_1.TravelPlanServices.generateTravelPlan(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: " AI Plan generated successfully",
        data: aiPlan,
    });
}));
const createTravelPlan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    console.log(req.body);
    const result = yield travelPlan_service_1.TravelPlanServices.createTravelPlan(decodedToken.userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Travel plan created successfully",
        data: result,
    });
}));
const updateTravelPlan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    console.log(req.params.id);
    const result = yield travelPlan_service_1.TravelPlanServices.updateTravelPlan(decodedToken.userId, req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Travel plan updated successfully",
        data: result,
    });
}));
const deleteTravelPlan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    yield travelPlan_service_1.TravelPlanServices.deleteTravelPlan(decodedToken.userId, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Travel plan deleted successfully",
        data: null,
    });
}));
const toggleVisibility = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield travelPlan_service_1.TravelPlanServices.toggleVisibility(decodedToken.userId, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Visibility updated successfully",
        data: result,
    });
}));
const getAllTravelPlans = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield travelPlan_service_1.TravelPlanServices.getAllTravelPlans(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Travel plans retrieved successfully",
        data: result,
    });
}));
const getMyTravelPlans = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userId = user === null || user === void 0 ? void 0 : user.userId;
    const result = yield travelPlan_service_1.TravelPlanServices.getMyTravelPlans(req.query, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Travel plans retrieved successfully",
        data: result,
    });
}));
const getTravelPlansById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield travelPlan_service_1.TravelPlanServices.getTravelPlansById(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Travel plans retrieved successfully",
        data: result,
    });
}));
exports.travelPlanControllers = {
    generateTravelPlan,
    createTravelPlan,
    updateTravelPlan,
    deleteTravelPlan,
    toggleVisibility,
    getAllTravelPlans,
    getTravelPlansById,
    getMyTravelPlans,
};
