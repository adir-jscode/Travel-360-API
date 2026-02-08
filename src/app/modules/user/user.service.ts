import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(400, "User is already exists");
  }

  //hashing password
  const hashedPassword = await bcryptjs.hash(password as string, 10);

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
const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId);
  return user;
};

export const UserServices = { createUser, getUserProfile, getAllUsers };
