import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { TripStatus } from './trip.model';
import { TripServices } from './trip.service';

const getMyTrips = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const data = await TripServices.getMyTrips(userId);
  sendResponse(res, { success: true, statusCode: 200, message: 'Trips fetched', data });
});

const getTripById = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const data = await TripServices.getTripById(req.params.id, userId);
  sendResponse(res, { success: true, statusCode: 200, message: 'Trip fetched', data });
});

const updateTripStatus = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const data = await TripServices.updateTripStatus(req.params.id, userId, req.body.status as TripStatus);
  sendResponse(res, { success: true, statusCode: 200, message: 'Trip status updated', data });
});

const uploadTripPhotos = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const files = req.files as Express.Multer.File[];
  const captions: string[] = Array.isArray(req.body.captions)
    ? req.body.captions
    : req.body.captions
    ? [req.body.captions]
    : [];

  const data = await TripServices.uploadTripPhotos(req.params.id, userId, files, captions);
  sendResponse(res, { success: true, statusCode: 201, message: 'Photos uploaded', data });
});

const deleteTripPhoto = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  await TripServices.deleteTripPhoto(req.params.id, req.params.photoId, userId);
  sendResponse(res, { success: true, statusCode: 200, message: 'Photo deleted', data: null });
});

const getAllTrips = catchAsync(async (req, res) => {
  const { data, meta } = await TripServices.getAllTrips(req.query as Record<string, string>);
  sendResponse(res, { success: true, statusCode: 200, message: 'All trips fetched', data, meta });
});

export const TripControllers = {
  getMyTrips,
  getTripById,
  updateTripStatus,
  uploadTripPhotos,
  deleteTripPhoto,
  getAllTrips,
};
