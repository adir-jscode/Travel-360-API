import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse.ts";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {}
};

//profile
const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {}
};

export const UserControllers = {
  createUser,
  getUserProfile,
};
