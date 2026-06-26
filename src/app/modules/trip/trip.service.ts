import { v2 as cloudinary } from 'cloudinary';
import AppError from '../../errorHelpers/AppError';
import { Trip, TripStatus } from './trip.model';

// ── Fetch helpers ────────────────────────────────────────────────────────────
const getMyTrips = async (userId: string) => {
  return Trip.find({ 'members.user': userId })
    .populate('travelPlan', 'destination startDate endDate travelType days budgetMin budgetMax itinerary')
    .populate('host', 'name picture bio rating')
    .populate('members.user', 'name picture bio rating')
    .sort({ createdAt: -1 })
    .lean();
};

const getTripById = async (tripId: string, userId: string) => {
  const trip = await Trip.findOne({ _id: tripId, 'members.user': userId })
    .populate('travelPlan', 'destination startDate endDate travelType days budgetMin budgetMax itinerary')
    .populate('host', 'name picture bio rating travelInterest visitedCountries')
    .populate('members.user', 'name picture bio rating travelInterest visitedCountries');
  if (!trip) throw new AppError(404, 'Trip not found or you are not a member');
  return trip;
};

// ── Status update (host only) ────────────────────────────────────────────────
const updateTripStatus = async (tripId: string, hostId: string, status: TripStatus) => {
  const trip = await Trip.findOne({ _id: tripId, host: hostId });
  if (!trip) throw new AppError(404, 'Trip not found or you are not the host');

  trip.status = status;
  await trip.save();
  return trip;
};

// ── Photo upload (any member) ────────────────────────────────────────────────
const uploadTripPhotos = async (
  tripId: string,
  userId: string,
  files: Express.Multer.File[],
  captions: string[],
) => {
  const trip = await Trip.findOne({ _id: tripId, 'members.user': userId });
  if (!trip) throw new AppError(404, 'Trip not found or you are not a member');
  if (!files || files.length === 0) throw new AppError(400, 'No files provided');

  const uploadPromises = files.map(
    (file, index) =>
      new Promise<{ url: string; publicId: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'travel-buddy/trip-photos',
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
            resolve({ url: result.secure_url, publicId: result.public_id });
          },
        );
        stream.end(file.buffer);
      }).then(({ url, publicId }) => ({
        url,
        publicId,
        uploadedBy: userId as unknown as import('mongoose').Types.ObjectId,
        caption: captions?.[index] ?? '',
        uploadedAt: new Date(),
      })),
  );

  const newPhotos = await Promise.all(uploadPromises);
  trip.photos.push(...newPhotos);
  await trip.save();
  return trip.photos;
};

// ── Delete a photo (uploader or host) ───────────────────────────────────────
const deleteTripPhoto = async (tripId: string, photoId: string, userId: string) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new AppError(404, 'Trip not found');

  const photo = trip.photos.find((p) => p._id?.toString() === photoId);
  if (!photo) throw new AppError(404, 'Photo not found');

  const isHost      = trip.host.toString() === userId;
  const isUploader  = photo.uploadedBy.toString() === userId;
  if (!isHost && !isUploader) throw new AppError(403, 'Not allowed to delete this photo');

  // Remove from Cloudinary
  await cloudinary.uploader.destroy(photo.publicId);

  trip.photos = trip.photos.filter((p) => p._id?.toString() !== photoId) as typeof trip.photos;
  await trip.save();
  return null;
};

// ── Get all trips (admin) ────────────────────────────────────────────────────
const getAllTrips = async (query: Record<string, string>) => {
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;

  const page  = parseInt(query.page  ?? '1');
  const limit = parseInt(query.limit ?? '10');
  const skip  = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Trip.find(filter)
      .populate('travelPlan', 'destination startDate endDate')
      .populate('host', 'name picture')
      .populate('members.user', 'name picture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Trip.countDocuments(filter),
  ]);

  return { data, meta: { total, page, limit } };
};

export const TripServices = {
  getMyTrips,
  getTripById,
  updateTripStatus,
  uploadTripPhotos,
  deleteTripPhoto,
  getAllTrips,
};
