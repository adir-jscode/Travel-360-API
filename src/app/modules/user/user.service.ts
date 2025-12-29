import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const userInfo = payload;
  const user = await User.create(userInfo);
  return user;
};

const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId);
  return user;
};

export const UserServices = { createUser, getUserProfile };
