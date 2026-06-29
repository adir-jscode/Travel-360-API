"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRequest = void 0;
const mongoose_1 = require("mongoose");
const joinRequest_interface_1 = require("./joinRequest.interface");
const joinRequestSchema = new mongoose_1.Schema({
    travelPlan: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TravelPlan', required: true, index: true },
    requester: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    host: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
        type: String,
        enum: Object.values(joinRequest_interface_1.JoinRequestStatus),
        default: joinRequest_interface_1.JoinRequestStatus.PENDING,
    },
    message: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true, versionKey: false });
// One user can only have one PENDING request per plan
joinRequestSchema.index({ travelPlan: 1, requester: 1 }, { unique: true });
exports.JoinRequest = (0, mongoose_1.model)('JoinRequest', joinRequestSchema);
