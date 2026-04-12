import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IReviewCreate, IReviewUpdate } from "./review.interface";

const reviewUserSelect = {
  select: {
    id: true,
    name: true,
    email: true,
    image: true,
  },
};

const reviewEventSelect = {
  select: {
    id: true,
    title: true,
    description: true,
  },
};

const createReview = async (userId: string, payload: IReviewCreate) => {
  // Check if user is the organizer of the event
  const event = await prisma.event.findUnique({
    where: { id: payload.eventId },
    select: { organizerId: true },
  });

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }

  if (event.organizerId === userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Organizers cannot review their own events",
    );
  }

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId: payload.eventId,
      },
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already reviewed this event",
    );
  }

  const result = await prisma.review.create({
    data: {
      userId,
      eventId: payload.eventId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      user: reviewUserSelect,
      event: reviewEventSelect,
    },
  });

  return result;
};

const updateReview = async (
  userId: string,
  reviewId: string,
  payload: IReviewUpdate,
) => {
  // Check if review exists and belongs to user
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (review.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only update your own review",
    );
  }

  const result = await prisma.review.update({
    where: { id: reviewId },
    data: payload,
    include: {
      user: reviewUserSelect,
      event: reviewEventSelect,
    },
  });

  return result;
};

const deleteReview = async (userId: string, reviewId: string) => {
  // Check if review exists and belongs to user
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (review.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only delete your own review",
    );
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return null;
};

export const ReviewServices = {
  createReview,
  updateReview,
  deleteReview,
};
