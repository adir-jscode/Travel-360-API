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
exports.TripServices = void 0;
const cloudinary_1 = require("cloudinary");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const trip_model_1 = require("./trip.model");
// ── Fetch helpers ────────────────────────────────────────────────────────────
const getMyTrips = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return trip_model_1.Trip.find({ 'members.user': userId })
        .populate('travelPlan', 'destination startDate endDate travelType days budgetMin budgetMax itinerary')
        .populate('host', 'name picture bio rating')
        .populate('members.user', 'name picture bio rating')
        .sort({ createdAt: -1 })
        .lean();
});
const getTripById = (tripId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const trip = yield trip_model_1.Trip.findOne({ _id: tripId, 'members.user': userId })
        .populate('travelPlan', 'destination startDate endDate travelType days budgetMin budgetMax itinerary')
        .populate('host', 'name picture bio rating travelInterest visitedCountries')
        .populate('members.user', 'name picture bio rating travelInterest visitedCountries');
    if (!trip)
        throw new AppError_1.default(404, 'Trip not found or you are not a member');
    return trip;
});
// ── Status update (host only) ────────────────────────────────────────────────
const updateTripStatus = (tripId, hostId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const trip = yield trip_model_1.Trip.findOne({ _id: tripId, host: hostId });
    if (!trip)
        throw new AppError_1.default(404, 'Trip not found or you are not the host');
    trip.status = status;
    yield trip.save();
    return trip;
});
// ── Photo upload (any member) ────────────────────────────────────────────────
const uploadTripPhotos = (tripId, userId, files, captions) => __awaiter(void 0, void 0, void 0, function* () {
    const trip = yield trip_model_1.Trip.findOne({ _id: tripId, 'members.user': userId });
    if (!trip)
        throw new AppError_1.default(404, 'Trip not found or you are not a member');
    if (!files || files.length === 0)
        throw new AppError_1.default(400, 'No files provided');
    const uploadPromises = files.map((file, index) => new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder: 'travel-buddy/trip-photos',
            resource_type: 'image',
        }, (error, result) => {
            if (error || !result)
                return reject(error !== null && error !== void 0 ? error : new Error('Cloudinary upload failed'));
            resolve({ url: result.secure_url, publicId: result.public_id });
        });
        stream.end(file.buffer);
    }).then(({ url, publicId }) => {
        var _a;
        return ({
            url,
            publicId,
            uploadedBy: userId,
            caption: (_a = captions === null || captions === void 0 ? void 0 : captions[index]) !== null && _a !== void 0 ? _a : '',
            uploadedAt: new Date(),
        });
    }));
    const newPhotos = yield Promise.all(uploadPromises);
    trip.photos.push(...newPhotos);
    yield trip.save();
    return trip.photos;
});
// ── Delete a photo (uploader or host) ───────────────────────────────────────
const deleteTripPhoto = (tripId, photoId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const trip = yield trip_model_1.Trip.findById(tripId);
    if (!trip)
        throw new AppError_1.default(404, 'Trip not found');
    const photo = trip.photos.find((p) => { var _a; return ((_a = p._id) === null || _a === void 0 ? void 0 : _a.toString()) === photoId; });
    if (!photo)
        throw new AppError_1.default(404, 'Photo not found');
    const isHost = trip.host.toString() === userId;
    const isUploader = photo.uploadedBy.toString() === userId;
    if (!isHost && !isUploader)
        throw new AppError_1.default(403, 'Not allowed to delete this photo');
    // Remove from Cloudinary
    yield cloudinary_1.v2.uploader.destroy(photo.publicId);
    trip.photos = trip.photos.filter((p) => { var _a; return ((_a = p._id) === null || _a === void 0 ? void 0 : _a.toString()) !== photoId; });
    yield trip.save();
    return null;
});
// ── Get all trips (admin) ────────────────────────────────────────────────────
const getAllTrips = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const filter = {};
    if (query.status)
        filter.status = query.status;
    const page = parseInt((_a = query.page) !== null && _a !== void 0 ? _a : '1');
    const limit = parseInt((_b = query.limit) !== null && _b !== void 0 ? _b : '10');
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        trip_model_1.Trip.find(filter)
            .populate('travelPlan', 'destination startDate endDate')
            .populate('host', 'name picture')
            .populate('members.user', 'name picture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        trip_model_1.Trip.countDocuments(filter),
    ]);
    return { data, meta: { total, page, limit } };
});
exports.TripServices = {
    getMyTrips,
    getTripById,
    updateTripStatus,
    uploadTripPhotos,
    deleteTripPhoto,
    getAllTrips,
};
