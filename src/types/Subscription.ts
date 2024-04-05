export type Subscription = {
  id: string;
  name: string;
  price: number;
  status: string;
  latest_invoice: string;
  current_period_start: number;
  current_period_end: number;
  days_until_due: number;
  default_payment_method: string;
  created: number;
};
