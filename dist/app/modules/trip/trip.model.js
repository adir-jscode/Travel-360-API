"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trip = exports.TripStatus = void 0;
const mongoose_1 = require("mongoose");
const trip_interface_1 = require("./trip.interface");
Object.defineProperty(exports, "TripStatus", { enumerable: true, get: function () { return trip_interface_1.TripStatus; } });
const tripMemberSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now },
}, { _id: false });
const tripPhotoSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, maxlength: 300 },
    uploadedAt: { type: Date, default: Date.now },
}, { _id: true });
const tripSchema = new mongoose_1.Schema({
    travelPlan: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TravelPlan', required: true, index: true },
    host: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: [tripMemberSchema],
    status: {
        type: String,
        enum: Object.values(trip_interface_1.TripStatus),
        default: trip_interface_1.TripStatus.UPCOMING,
    },
    photos: [tripPhotoSchema],
}, { timestamps: true, versionKey: false });
exports.Trip = (0, mongoose_1.model)('Trip', tripSchema);
