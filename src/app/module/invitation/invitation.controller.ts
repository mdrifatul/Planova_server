import { Request, Response } from "express";
import httpStatus from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { InvitationServices } from "./invitation.service";

const sendInvitation = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await InvitationServices.sendInvitation(userId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Invitation sent successfully",
    data: result,
  });
});

const getReceivedInvitations = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await InvitationServices.getReceivedInvitations(
      userId,
      req.query as IQueryParams,
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Received invitations retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getSentInvitations = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await InvitationServices.getSentInvitations(
    userId,
    req.query as IQueryParams,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Sent invitations retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getEventInvitations = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const eventId = req.params.eventId as string;

  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await InvitationServices.getEventInvitations(
    eventId,
    userId,
    req.query as IQueryParams,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Event invitations retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getInvitationById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const invitationId = req.params.id as string;

  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await InvitationServices.getInvitationById(
    invitationId,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Invitation retrieved successfully",
    data: result,
  });
});

const updateInvitation = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const invitationId = req.params.id as string;

  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await InvitationServices.updateInvitation(
    userId,
    invitationId,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Invitation updated successfully",
    data: result,
  });
});

const deleteInvitation = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const invitationId = req.params.id as string;

  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  await InvitationServices.deleteInvitation(userId, invitationId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Invitation deleted successfully",
    data: null,
  });
});

export const InvitationController = {
  sendInvitation,
  getReceivedInvitations,
  getSentInvitations,
  getEventInvitations,
  getInvitationById,
  updateInvitation,
  deleteInvitation,
};
