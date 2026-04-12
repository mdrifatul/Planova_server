import httpStatus from "http-status";
import {
  Event,
  ParticipationStatus,
} from "../../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
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

// ── Helper function to generate tags based on visibility, fee, and category ──
const generateEventTags = (
  visibility?: string,
  fee?: number,
  categoryName?: string | null,
) => {
  const tags: string[] = [];

  if (visibility === "PUBLIC") {
    tags.push("PUBLIC");
  } else if (visibility === "PRIVATE") {
    tags.push("PRIVATE");
  }

  if (!fee || fee === 0) {
    tags.push("FREE");
  } else {
    tags.push("PAID");
  }

  if (categoryName) {
    tags.push(categoryName);
  }

  return tags;
};

const createEvent = async (userId: string, payload: IEventCreate) => {
  const result = await prisma.event.create({
    data: {
      ...payload,
      organizerId: userId,
    },
    include: {
      organizer: organizerSelect,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    ...result,
    tags: generateEventTags(
      result.visibility,
      result.fee,
      result.category?.name,
    ),
  };
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventsWithTags = result.data.map((event: any) => ({
    ...event,
    tags: generateEventTags(event.visibility, event.fee, event.category?.name),
  }));

  return { ...result, data: eventsWithTags };
};

const getEventById = async (id: string) => {
  const result = await prisma.event.findUnique({
    where: { id },
    include: {
      ...eventIncludeConfig,
    },
  });

  if (!result) return null;

  return {
    ...result,
    tags: generateEventTags(
      result.visibility,
      result.fee,
      result.category?.name,
    ),
  };
};

const updateEvent = async (id: string, payload: IEventUpdate) => {
  const result = await prisma.event.update({
    where: { id },
    data: payload,
    include: {
      organizer: organizerSelect,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    ...result,
    tags: generateEventTags(
      result.visibility,
      result.fee,
      result.category?.name,
    ),
  };
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventsWithTags = result.data.map((event: any) => ({
    ...event,
    tags: generateEventTags(event.visibility, event.fee, event.category?.name),
  }));

  return { ...result, data: eventsWithTags };
};

const getEventParticipants = async (
  eventId: string,
  queryParams: IQueryParams,
) => {
  // Verify event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }

  const result = await new QueryBuilder(prisma.participation, queryParams, {
    searchableFields: ["user.name", "user.email"],
    filterableFields: ["status", "paymentStatus"],
  })
    .search()
    .filter()
    .where({ eventId })
    .paginate()
    .sort()
    .dynamicInclude(
      {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      ["user"],
    )
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
  getEventParticipants,
};
