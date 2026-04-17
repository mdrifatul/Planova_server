import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AIService } from "./ai.service";

const getSearchSuggestions = catchAsync(async (req, res) => {
  const query = req.query.q as string;
  const result = await AIService.getSearchSuggestions(query);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Search suggestions retrieved successfully",
    data: result,
  });
});

const getRecommendations = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await AIService.getRecommendations(userId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Personalized recommendations retrieved successfully",
    data: result,
  });
});

const getTrending = catchAsync(async (req, res) => {
  const result = await AIService.getTrending();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Trending events retrieved successfully",
    data: result,
  });
});

const chatAssistant = catchAsync(async (req, res) => {
  const { message } = req.body;

  const result = await AIService.chatWithAssistant(message);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Chat response generated successfully",
    data: result,
  });
});

export const AIController = {
  getSearchSuggestions,
  getRecommendations,
  getTrending,
  chatAssistant,
};
