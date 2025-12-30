import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.type";

export const handleCastError = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: 400, // Bad Request
    message: `Invalid Object ID. Please provide a valid ID.`,
  };
};
