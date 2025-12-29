import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const userInfo = payload;
  const user = await User.create(userInfo);
  return user;
};

export const UserServices = { createUser };
