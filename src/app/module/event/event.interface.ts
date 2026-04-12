export type TEventVisibility = "PUBLIC" | "PRIVATE";
export type TCurrency = "USD" | "BDT" | "AED" | "EUR" | "GBP";


export interface IEventCreate {
  title: string;
  description?: string;
  date: Date;
  endDate?: Date;
  venue?: string;
  maxAttendees?: number;
  fee?: number;
  currency?: TCurrency;
  startTime?: string;
  endTime?: string;
  visibility?: TEventVisibility;
  imageUrl?: string;
  categoryId?: string;
  tags?: string[];
}

export interface IEventUpdate {
  title?: string;
  description?: string;
  date?: Date;
  endDate?: Date;
  venue?: string;
  maxAttendees?: number;
  fee?: number;
  currency?: TCurrency;
  visibility?: TEventVisibility;
  imageUrl?: string;
  categoryId?: string;
  tags?: string[];
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export interface IEventFilters {
  search?: string;
  visibility?: TEventVisibility;
  isFree?: boolean;
  categoryId?: string;
  page?: number;
  limit?: number;
}
