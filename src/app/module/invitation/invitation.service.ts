import httpStatus from "http-status";
import {
  Invitation,
  InvitationStatus,
  ParticipationStatus,
  PaymentStatus,
} from "../../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../shared/QueryBuilder";
import { ISendInvitation, IUpdateInvitation } from "./invitation.interface";

// ── Reusable sender/receiver/event select shapes ──
const senderSelect = {
  select: {
    id: true,
    name: true,
    email: true,
    image: true,
  },
};

const receiverSelect = {
  select: {
    id: true,
    name: true,
    email: true,
    image: true,
  },
};

const eventSelect = {
  select: {
    id: true,
    title: true,
    date: true,
    venue: true,
    imageUrl: true,
  },
};

// ── Include config for invitations ──

const invitationIncludeConfig = {
  sender: senderSelect,
  receiver: receiverSelect,
  event: eventSelect,
};

/**
 * Send invitation to a user for an event.
 * Only the event organizer can send invitations.
 * Cannot invite someone already participating or the organizer themselves.
 */
const sendInvitation = async (
  senderId: string,
  payload: ISendInvitation,
): Promise<Invitation> => {
  const { receiverId, eventId } = payload;

  // 1. Fetch event and verify sender is the organizer
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }

  if (event.organizerId !== senderId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only the event organizer can send invitations",
    );
  }

  // 2. Prevent inviting the organizer themselves
  if (receiverId === senderId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot invite yourself to your own event",
    );
  }

  // 3. Verify receiver exists
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!receiver) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver user not found");
  }

  // 4. Check if receiver already has a participation in this event
  const existingParticipation = await prisma.participation.findUnique({
    where: {
      userId_eventId: { userId: receiverId, eventId },
    },
  });

  if (existingParticipation) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already has a participation status for this event",
    );
  }

  // 5. Check if invitation already exists
  const existingInvitation = await prisma.invitation.findUnique({
    where: {
      receiverId_eventId: { receiverId, eventId },
    },
  });

  if (existingInvitation) {
    throw new AppError(
      httpStatus.CONFLICT,
      "An invitation has already been sent to this user for this event",
    );
  }

  // 6. Create and return invitation
  const invitation = await prisma.invitation.create({
    data: {
      senderId,
      receiverId,
      eventId,
    },
    include: invitationIncludeConfig,
  });

  return invitation;
};

/**
 * Get received invitations for the current user.
 * Supports search, filter, pagination, and sorting.
 */
const getReceivedInvitations = async (
  userId: string,
  queryParams: IQueryParams,
) => {
  const result = await new QueryBuilder<Invitation>(
    prisma.invitation,
    queryParams,
    {},
  )
    .where({ receiverId: userId })
    .paginate()
    .sort()
    .dynamicInclude(invitationIncludeConfig, ["sender", "receiver", "event"])
    .execute();

  return result;
};

/**
 * Get sent invitations from the current user.
 * Supports search, filter, pagination, and sorting.
 */
const getSentInvitations = async (
  userId: string,
  queryParams: IQueryParams,
) => {
  const result = await new QueryBuilder<Invitation>(
    prisma.invitation,
    queryParams,
    {},
  )
    .where({ senderId: userId })
    .paginate()
    .sort()
    .dynamicInclude(invitationIncludeConfig, ["sender", "receiver", "event"])
    .execute();

  return result;
};

/**
 * Get all invitations for an event (for organizer).
 */
const getEventInvitations = async (
  eventId: string,
  organizerId: string,
  queryParams: IQueryParams,
) => {
  // Verify event exists and user is the organizer
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }

  if (event.organizerId !== organizerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to view invitations for this event",
    );
  }

  const result = await new QueryBuilder<Invitation>(
    prisma.invitation,
    queryParams,
    {},
  )
    .where({ eventId })
    .paginate()
    .sort()
    .dynamicInclude(invitationIncludeConfig, ["sender", "receiver", "event"])
    .execute();

  return result;
};

/**
 * Get a single invitation by ID.
 */
const getInvitationById = async (
  invitationId: string,
  userId: string,
): Promise<Invitation> => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: invitationIncludeConfig,
  });

  if (!invitation) {
    throw new AppError(httpStatus.NOT_FOUND, "Invitation not found");
  }

  // Verify the user is either the sender or receiver
  if (invitation.senderId !== userId && invitation.receiverId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to view this invitation",
    );
  }

  return invitation;
};

/**
 * Update invitation status (ACCEPTED or DECLINED).
 * Only the receiver can update the status.
 * If ACCEPTED, create a participation record automatically.
 */
const updateInvitation = async (
  userId: string,
  invitationId: string,
  payload: IUpdateInvitation,
): Promise<Invitation> => {
  const { status } = payload;

  // 1. Fetch invitation
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: {
      event: true,
    },
  });

  if (!invitation) {
    throw new AppError(httpStatus.NOT_FOUND, "Invitation not found");
  }

  // 2. Verify user is the receiver
  if (invitation.receiverId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only the recipient can update this invitation",
    );
  }

  // 3. If ACCEPTED, create participation record
  if (status === InvitationStatus.ACCEPTED) {
    // Check if participation already exists
    const existingParticipation = await prisma.participation.findUnique({
      where: {
        userId_eventId: {
          userId: invitation.receiverId,
          eventId: invitation.eventId,
        },
      },
    });

    if (existingParticipation) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Participation record already exists for this user and event",
      );
    }

    // Create participation (already approved since it's through invitation)
    await prisma.participation.create({
      data: {
        userId: invitation.receiverId,
        eventId: invitation.eventId,
        status: ParticipationStatus.APPROVED,
        paymentStatus: PaymentStatus.PAID, // Invited users are considered paid
      },
    });
  }

  // 4. Update invitation status
  const updatedInvitation = await prisma.invitation.update({
    where: { id: invitationId },
    data: { status },
    include: invitationIncludeConfig,
  });

  return updatedInvitation;
};

/**
 * Delete/cancel an invitation.
 * Sender can cancel any time. Receiver can only delete pending invitations.
 */
const deleteInvitation = async (
  userId: string,
  invitationId: string,
): Promise<void> => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) {
    throw new AppError(httpStatus.NOT_FOUND, "Invitation not found");
  }

  // Allow sender to delete anytime, receiver only for PENDING
  const isSender = invitation.senderId === userId;
  const isReceiver = invitation.receiverId === userId;

  if (!isSender && !isReceiver) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to delete this invitation",
    );
  }

  if (isReceiver && invitation.status !== "PENDING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only delete pending invitations",
    );
  }

  // If invitation was accepted, don't delete the participation record
  await prisma.invitation.delete({
    where: { id: invitationId },
  });
};

export const InvitationServices = {
  sendInvitation,
  getReceivedInvitations,
  getSentInvitations,
  getEventInvitations,
  getInvitationById,
  updateInvitation,
  deleteInvitation,
};
