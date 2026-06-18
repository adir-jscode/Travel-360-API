import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

/*
{
req.user
[1]   userId: '69956a605e7f179f61b8972f',
[1]   email: 'adir25new0@gmail.com',
[1]   role: 'USER',
[1]   iat: 1781771110,
[1]   exp: 1781857510
[1] }


*/

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(400, "User is already exists");
  }

  //hashing password
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  const authProvider: IAuthProvider = {
    provider: "CREDENTIAL",
    providerId: email as string,
  };
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

//all users

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

// public profile view other users
const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select(
    "-password -isDeleted -isActive -isVerified -createdAt -updatedAt -auths",
  );
  if (!user) {
    throw new AppError(400, "User not found");
  }
  if (
    user.role === Role.ADMIN ||
    user.role === Role.SUPER_ADMIN ||
    user.role === Role.GUIDE
  ) {
    throw new AppError(403, "You are not authorized to access this profile");
  }
  return user;
};

const updateUser = async (
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const userId = decodedToken.userId;
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(400, "User not found");
  }
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(403, "You are not authorized");
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(403, "You are not authorized");
    }
  }
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(403, "You are not authorized");
    }
  }
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND),
    );
  }
  const updatedUserInfo = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return updatedUserInfo;
};

export const UserServices = {
  createUser,
  getUserProfile,
  getAllUsers,
  updateUser,
};
