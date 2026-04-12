export type TInvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface ISendInvitation {
  receiverId: string;
  eventId: string;
}

export interface IUpdateInvitation {
  status: TInvitationStatus;
}

export interface IInvitationFilters {
  status?: TInvitationStatus;
  eventId?: string;
  page?: number;
  limit?: number;
}
