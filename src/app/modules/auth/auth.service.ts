import bcryptjs from "bcryptjs";
import { generateToken } from "../../../utils/jwt";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
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
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(jwtPayload, "secret", "1d");
  return {
    email: isUserExist.email,
    accessToken,
  };
};

export const AuthServices = { credentialLogin };
