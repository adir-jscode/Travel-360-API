import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { upload } from '../../middlewares/upload';
import { Role } from '../user/user.interface';
import { TripControllers } from './trip.controller';

const router = express.Router();

const authUser  = checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN, Role.GUIDE);
const authAdmin = checkAuth(Role.ADMIN, Role.SUPER_ADMIN);

// My trips (as member)
router.get('/my-trips', authUser, TripControllers.getMyTrips);

// Admin: all trips
router.get('/', authAdmin, TripControllers.getAllTrips);

// Single trip (member access)
router.get('/:id', authUser, TripControllers.getTripById);

// Host updates trip status
router.patch('/:id/status', authUser, TripControllers.updateTripStatus);

// Upload multiple photos to a trip (max 10 at once)
router.post(
  '/:id/photos',
  authUser,
  upload.array('photos', 10),
  TripControllers.uploadTripPhotos,
);

// Delete a specific photo
router.delete('/:id/photos/:photoId', authUser, TripControllers.deleteTripPhoto);

export const TripRoutes = router;
