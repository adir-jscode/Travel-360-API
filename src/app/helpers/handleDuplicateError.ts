/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.type";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  return {
    statusCode: 409, //conflict
    message: `Duplicate value entered for ${matchedArray?.[1]}. Please use another value!`,
  };
};
