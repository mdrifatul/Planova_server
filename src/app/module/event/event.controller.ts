import { Request, Response } from "express";
import httpStatus from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { EventServices } from "./event.service";

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }
  const result = await EventServices.createEvent(userId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Event created successfully",
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventServices.getAllEvents(req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Events retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getEventById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await EventServices.getEventById(id);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Event retrieved successfully",
    data: result,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await EventServices.updateEvent(id, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Event updated successfully",
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await EventServices.deleteEvent(id);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Event deleted successfully",
    data: null,
  });
});

const getMyEvents = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }
  const result = await EventServices.getMyEvents(
    userId,
    req.query as IQueryParams,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "My events retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const EventController = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
};
