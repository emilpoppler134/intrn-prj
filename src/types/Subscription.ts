export type Subscription = {
  id: string;
  name: string;
  price: number;
  current_period_start: Date;
  current_period_end: Date;
  days_until_due: number;
  default_payment_method: string;
  created: Date;
}