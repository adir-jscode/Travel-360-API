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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const trip_service_1 = require("./trip.service");
const getMyTrips = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const data = yield trip_service_1.TripServices.getMyTrips(userId);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Trips fetched', data });
}));
const getTripById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const data = yield trip_service_1.TripServices.getTripById(req.params.id, userId);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Trip fetched', data });
}));
const updateTripStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const data = yield trip_service_1.TripServices.updateTripStatus(req.params.id, userId, req.body.status);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Trip status updated', data });
}));
const uploadTripPhotos = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const files = req.files;
    const captions = Array.isArray(req.body.captions)
        ? req.body.captions
        : req.body.captions
            ? [req.body.captions]
            : [];
    const data = yield trip_service_1.TripServices.uploadTripPhotos(req.params.id, userId, files, captions);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 201, message: 'Photos uploaded', data });
}));
const deleteTripPhoto = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    yield trip_service_1.TripServices.deleteTripPhoto(req.params.id, req.params.photoId, userId);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Photo deleted', data: null });
}));
const getAllTrips = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield trip_service_1.TripServices.getAllTrips(req.query);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'All trips fetched', data, meta });
}));
exports.TripControllers = {
    getMyTrips,
    getTripById,
    updateTripStatus,
    uploadTripPhotos,
    deleteTripPhoto,
    getAllTrips,
};
