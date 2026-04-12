export interface IReviewCreate {
  rating: number;
  comment?: string;
  eventId: string;
}

export interface IReviewUpdate {
  rating?: number;
  comment?: string;
}
