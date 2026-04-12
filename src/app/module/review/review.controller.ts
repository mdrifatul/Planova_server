import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await ReviewServices.createReview(userId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const reviewId = req.params.id as string;
  const result = await ReviewServices.updateReview(userId, reviewId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const reviewId = req.params.id as string;
  await ReviewServices.deleteReview(userId, reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    data: null,
  });
});

export const ReviewController = {
  createReview,
  updateReview,
  deleteReview,
};
