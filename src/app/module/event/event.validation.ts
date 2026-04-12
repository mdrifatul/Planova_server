import { z } from "zod";

const createEvent = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  endDate: z
    .string()
    .or(z.date())
    .optional()
    .transform((val) => (val ? new Date(val as string | Date) : undefined)),
  venue: z.string().optional(),
  maxAttendees: z.number().int().positive().optional(),
  fee: z.number().min(0).default(0),
  currency: z.enum(["USD", "BDT", "AED", "EUR", "GBP"]).default("USD").optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  imageUrl: z.string().url().optional().or(z.string().optional()),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateEvent = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z
    .string()
    .or(z.date())
    .optional()
    .transform((val) => (val ? new Date(val as string | Date) : undefined)),
  endDate: z
    .string()
    .or(z.date())
    .optional()
    .transform((val) => (val ? new Date(val as string | Date) : undefined)),
  venue: z.string().optional(),
  maxAttendees: z.number().int().positive().optional(),
  fee: z.number().min(0).optional(),
  currency: z.enum(["USD", "BDT", "AED", "EUR", "GBP"]).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  imageUrl: z.string().url().optional().or(z.string().optional()),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type TCreateEvent = z.infer<typeof createEvent>;
export type TUpdateEvent = z.infer<typeof updateEvent>;

export const EventValidation = {
  createEvent,
  updateEvent,
};
