export type User = {
  id: string;
  name: string;
  email: string;
  customer_id: string;
  subscription: {
    status: "active" | "past_due" | null;
    subscription_id: string | null;
  };
};
