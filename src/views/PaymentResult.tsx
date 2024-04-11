import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentResultHandler from "../components/PaymentResultHandler";
import Layout from "../components/layouts/Layout";
import { STRIPE_PUBLIC_KEY } from "../config";
import { useAuth } from "../provider/authProvider";
import { Breadcrumb } from "../types/Breadcrumb";
import { ResponseError } from "../utils/ResponseError";
import { callAPI } from "../utils/apiService";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default function PaymentResult() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { signNewToken } = useAuth();

  const clientSecret = new URLSearchParams(search).get(
    "payment_intent_client_secret"
  );
  const productId = new URLSearchParams(search).get("product_id");

  const confirmMutation = useMutation({
    mutationFn: () => callAPI("/subscriptions/confirm"),
    onSuccess: () => {
      signNewToken().then(() => {
        const notification = {
          title: "Success!",
          message: "Your subscription has been activated.",
        };

        navigate("/dashboard", { replace: true, state: { notification } });
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof ResponseError
          ? err.message + " Please try signing out and signing in again."
          : "Something went wrong.";

      navigate("/dashboard/", {
        replace: true,
        state: { error: { message } },
      });
    },
  });

  const callback = (status: string) => {
    switch (status) {
      case "succeeded": {
        confirmMutation.mutate();
        break;
      }

      case "requires_payment_method": {
        const message = "Payment failed. Please try another payment method.";

        const searchParams = [
          "payment_intent_client_secret=" + clientSecret,
          "product_id=" + productId,
        ];

        navigate("/subscriptions/payment?" + searchParams.join("&"), {
          replace: true,
          state: { error: { message } },
        });
        break;
      }

      default: {
        const message = "Something went wrong.";

        const searchParams = [
          "payment_intent_client_secret=" + clientSecret,
          "product_id=" + productId,
        ];

        navigate("/subscriptions/payment?" + searchParams.join("&"), {
          replace: true,
          state: { error: { message } },
        });
        break;
      }
    }
  };

  const breadcrumb: Breadcrumb = [
    { title: "Subscriptions", to: "/subscriptions" },
    { title: "Payment" },
    { title: "Result" },
  ];

  if (!stripePromise || clientSecret === null || productId === null) {
    return (
      <Layout
        breadcrumb={breadcrumb}
        error={new Error("Something went wrong.")}
      />
    );
  }

  return (
    <Layout breadcrumb={breadcrumb}>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentResultHandler clientSecret={clientSecret} callback={callback} />
      </Elements>
    </Layout>
  );
}
