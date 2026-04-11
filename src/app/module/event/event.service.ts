import {
  Event,
  ParticipationStatus,
} from "../../../../generated/prisma/client";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../shared/QueryBuilder";
import { IEventCreate, IEventUpdate } from "./event.interface";

// ── Reusable organizer select shape ──
const organizerSelect = {
  select: {
    id: true,
    name: true,
    email: true,
    image: true,
    role: true,
    phone: true,
  },
};

// ── Search & filter config for events ──
const eventSearchableFields = [
  "title",
  "description",
  "startTime",
  "endTime",
  "organizer.name",
  "category.name",
];

const eventFilterableFields = [
  "visibility",
  "categoryId",
  "fee",
  "isActive",
  "organizerId",
];

// ── Include config for dynamic includes ──
const eventIncludeConfig = {
  organizer: organizerSelect,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  _count: {
    select: {
      participations: true,
      reviews: true,
    },
  },
  participations: {
    where: { status: ParticipationStatus.APPROVED },
    select: {
      id: true,
      userId: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  },
  reviews: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  },
};

const createEvent = async (userId: string, payload: IEventCreate) => {
  const result = await prisma.event.create({
    data: {
      ...payload,
      organizerId: userId,
    },
    include: {
      organizer: organizerSelect,
    },
  });
  return result;
};

const getAllEvents = async (queryParams: IQueryParams) => {
  const result = await new QueryBuilder<Event>(prisma.event, queryParams, {
    searchableFields: eventSearchableFields,
    filterableFields: eventFilterableFields,
  })
    .search()
    .filter()
    .paginate()
    .sort()
    .dynamicInclude(eventIncludeConfig, ["organizer", "category", "_count"])
    .execute();

  return result;
};

const getEventById = async (id: string) => {
  const result = await prisma.event.findUnique({
    where: { id },
    include: {
      ...eventIncludeConfig,
    },
  });
  return result;
};

const updateEvent = async (id: string, payload: IEventUpdate) => {
  const result = await prisma.event.update({
    where: { id },
    data: payload,
    include: {
      organizer: organizerSelect,
    },
  });
  return result;
};

const deleteEvent = async (id: string) => {
  await prisma.event.delete({
    where: { id },
  });
  return null;
};

const getMyEvents = async (userId: string, queryParams: IQueryParams) => {
  const result = await new QueryBuilder<Event>(prisma.event, queryParams, {
    searchableFields: eventSearchableFields,
    filterableFields: eventFilterableFields,
  })
    .search()
    .filter()
    .where({ organizerId: userId })
    .paginate()
    .sort()
    .dynamicInclude(eventIncludeConfig, ["organizer", "category", "_count"])
    .execute();

  return result;
};

export const EventServices = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
};
