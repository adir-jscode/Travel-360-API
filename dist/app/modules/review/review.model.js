"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    reviewer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reviewee: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    trip: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    isEdited: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
// One review per reviewer→reviewee pair per trip
reviewSchema.index({ reviewer: 1, reviewee: 1, trip: 1 }, { unique: true });
exports.Review = (0, mongoose_1.model)('Review', reviewSchema);
