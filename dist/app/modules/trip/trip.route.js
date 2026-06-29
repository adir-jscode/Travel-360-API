"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const upload_1 = require("../../middlewares/upload");
const user_interface_1 = require("../user/user.interface");
const trip_controller_1 = require("./trip.controller");
const router = express_1.default.Router();
const authUser = (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.GUIDE);
const authAdmin = (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN);
// My trips (as member)
router.get('/my-trips', authUser, trip_controller_1.TripControllers.getMyTrips);
// Admin: all trips
router.get('/', authAdmin, trip_controller_1.TripControllers.getAllTrips);
// Single trip (member access)
router.get('/:id', authUser, trip_controller_1.TripControllers.getTripById);
// Host updates trip status
router.patch('/:id/status', authUser, trip_controller_1.TripControllers.updateTripStatus);
// Upload multiple photos to a trip (max 10 at once)
router.post('/:id/photos', authUser, upload_1.upload.array('photos', 10), trip_controller_1.TripControllers.uploadTripPhotos);
// Delete a specific photo
router.delete('/:id/photos/:photoId', authUser, trip_controller_1.TripControllers.deleteTripPhoto);
exports.TripRoutes = router;
