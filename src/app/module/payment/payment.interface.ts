export interface IPaymentCreate {
  participationId: string;
  amount: number;
  currency?: string;
}

export interface IPaymentCheckout {
  participationId: string;
}
