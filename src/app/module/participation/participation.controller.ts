import { Request, Response } from "express";
import httpStatus from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ParticipationService } from "./participation.service";

const joinEvent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const eventId = req.params.eventId as string;
  const result = await ParticipationService.joinEvent(userId, eventId);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully joined the event",
    data: result,
  });
});

const updateParticipationStatus = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Unauthorized",
      });
    }

    const userRole = req.user?.role as string;
    const participationId = req.params.participationId as string;
    const { status } = req.body;

    const result = await ParticipationService.updateParticipationStatus(
      userId,
      participationId,
      status,
      userRole,
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Participation status updated successfully",
      data: result,
    });
  },
);

const deleteParticipation = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Unauthorized",
      });
    }

    const userRole = req.user?.role as string;
    const participationId = req.params.participationId as string;

    await ParticipationService.deleteParticipation(
      userId,
      participationId,
      userRole,
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Participation deleted successfully",
      data: null,
    });
  },
);

const getMyParticipations = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await ParticipationService.getMyParticipations(
      userId,
      req.query as IQueryParams,
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "My participations retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

export const ParticipationController = {
  joinEvent,
  updateParticipationStatus,
  deleteParticipation,
  getMyParticipations,
};
