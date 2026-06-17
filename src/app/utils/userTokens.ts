import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.ACCESS_TOKEN_EXPIRE,
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.REFRESH_TOKEN_EXPIRE,
  );

  return {
    accessToken,
    refreshToken,
  };
};
