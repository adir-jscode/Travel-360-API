import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { generateToken, verifyToken } from "../../utils/jwt";
import { sendEmail } from "../../utils/sendEmail";
import { createUserTokens } from "../../utils/userTokens";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(400, "Invalid Email Address");
  }
  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string,
  );
  if (!isPasswordMatch) {
    throw new AppError(400, "Incorrect Password");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(400, "You are not verified");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(400, `User is ${isUserExist.isActive}`);
  }
  if (isUserExist.isDeleted) {
    throw new AppError(400, "User is deleted");
  }

  const tokens = createUserTokens(isUserExist);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET,
  ) as JwtPayload;

  const isUserExist = await User.findOne({
    email: verifiedRefreshToken.email,
  });
  if (!isUserExist) {
    throw new AppError(400, "User does not exists");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(400, `User is ${isUserExist.isActive}`);
  }
  if (isUserExist.isDeleted) {
    throw new AppError(400, "User is deleted");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.ACCESS_TOKEN_EXPIRE,
  );
  return { accessToken };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(400, "user not found");
  }
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user.password as string,
  );

  if (!isOldPasswordMatch) {
    throw new AppError(401, "Old password does not match");
  }
  if (newPassword === oldPassword) {
    throw new AppError(400, "New password must be different from old password");
  }

  const hashNewPassword = await bcryptjs.hash(
    newPassword as string,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  user.password = hashNewPassword;

  await user.save();
};

const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(400, "User does not exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(400, "User is not verified");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(400, `User is ${isUserExist.isActive}`);
  }
  if (isUserExist.isDeleted) {
    throw new AppError(400, "User is deleted");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.ACCESS_TOKEN_EXPIRE, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  await sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};

export const AuthServices = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
  forgotPassword,
};
