import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserServices } from "./user.service";

const getUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getUser();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await UserServices.getUserById(id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await UserServices.updateUser(id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const UserController = {
  getUser,
  getUserById,
  updateUser,
};
