import httpStatus from "http-status";
import {
  ParticipationStatus,
  PaymentStatus,
  Role,
} from "../../../generated/client";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../shared/QueryBuilder";

// ── Reusable user select shape ──
const participantUserSelect = {
  select: {
    id: true,
    name: true,
    email: true,
    image: true,
  },
};

const joinEvent = async (userId: string, eventId: string) => {
  // 1. Fetch event and validate
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      _count: {
        select: { participations: true },
      },
    },
  });

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }

  if (!event.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "Event is no longer active");
  }

  // 2. Prevent organizer from joining their own event
  if (event.organizerId === userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot join your own event",
    );
  }

  // 3. Check maxAttendees capacity
  if (
    event.maxAttendees !== null &&
    event._count.participations >= event.maxAttendees
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Event has reached maximum capacity",
    );
  }

  // 4. Prevent duplicate participation
  const existingParticipation = await prisma.participation.findUnique({
    where: {
      userId_eventId: { userId, eventId },
    },
  });

  if (existingParticipation) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already joined or requested to join this event",
    );
  }

  // 5. Free vs Paid logic
  const isFree = !event.fee || event.fee === 0;

  const participation = await prisma.participation.create({
    data: {
      userId,
      eventId,
      status: isFree
        ? ParticipationStatus.APPROVED
        : ParticipationStatus.PENDING,
      paymentStatus: isFree ? PaymentStatus.PAID : PaymentStatus.UNPAID,
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          fee: true,
        },
      },
    },
  });

  return participation;
};

const updateParticipationStatus = async (
  userId: string,
  participationId: string,
  status: ParticipationStatus,
  userRole: string,
) => {
  const participation = await prisma.participation.findUnique({
    where: { id: participationId },
    include: { event: true },
  });

  if (!participation) {
    throw new AppError(httpStatus.NOT_FOUND, "Participation request not found");
  }

  // Organizers can only modify participations for their own events
  if (
    userRole === Role.ORGANIZER &&
    participation.event.organizerId !== userId
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to modify participations for this event",
    );
  }

  const updatedParticipation = await prisma.participation.update({
    where: { id: participationId },
    data: { status },
    include: {
      user: participantUserSelect,
      event: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return updatedParticipation;
};

const deleteParticipation = async (
  userId: string,
  participationId: string,
  userRole: string,
) => {
  const participation = await prisma.participation.findUnique({
    where: { id: participationId },
    include: { event: true },
  });

  if (!participation) {
    throw new AppError(httpStatus.NOT_FOUND, "Participation not found");
  }

  // Authorization: owner, admin, or organizer of the event
  const isOwner = participation.userId === userId;
  const isAdmin = userRole === Role.ADMIN;
  const isOrganizerOfEvent =
    userRole === Role.ORGANIZER && participation.event.organizerId === userId;

  if (!isOwner && !isAdmin && !isOrganizerOfEvent) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to delete this participation",
    );
  }

  await prisma.participation.delete({
    where: { id: participationId },
  });

  return null;
};

const getMyParticipations = async (
  userId: string,
  queryParams: IQueryParams,
) => {
  const result = await new QueryBuilder(prisma.participation, queryParams)
    .where({ userId })
    .paginate()
    .sort()
    .dynamicInclude(
      {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            startTime: true,
            endTime: true,
            venue: true,
            fee: true,
            currency: true,
            imageUrl: true,
            organizer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      ["event"],
    )
    .execute();

  return result;
};

export const ParticipationService = {
  joinEvent,
  updateParticipationStatus,
  deleteParticipation,
  getMyParticipations,
};
