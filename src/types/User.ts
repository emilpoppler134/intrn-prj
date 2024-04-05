export type User = {
  _id: string;
  name: string;
  email: string;
  customer_id: string;
  subscription: Subscription;
};

type Subscription = {
  status: "active" | "past_due" | null;
  subscription_id: string | null;
};
