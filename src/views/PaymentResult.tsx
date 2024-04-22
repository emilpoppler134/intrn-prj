import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentResultHandler from "../components/PaymentResultHandler";
import ErrorLayout from "../components/layouts/ErrorLayout";
import Layout from "../components/layouts/Layout";
import { STRIPE_PUBLIC_KEY } from "../config";
import { ErrorWarning } from "../hooks/useWarnings";
import { useAuth } from "../provider/authProvider";
import { Breadcrumb } from "../types/Breadcrumb";
import { callAPI } from "../utils/apiService";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default function PaymentResult() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { signNewToken } = useAuth();

  const clientSecret = new URLSearchParams(search).get(
    "payment_intent_client_secret",
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
    onError: (err: Error) => {
      navigate("/dashboard/", {
        replace: true,
        state: { error: new ErrorWarning(err.message) },
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
        const searchParams = [
          "payment_intent_client_secret=" + clientSecret,
          "product_id=" + productId,
        ];

        navigate("/subscriptions/payment?" + searchParams.join("&"), {
          replace: true,
          state: {
            error: new ErrorWarning(
              "Payment failed. Please try another payment method.",
            ),
          },
        });
        break;
      }

      default: {
        const searchParams = [
          "payment_intent_client_secret=" + clientSecret,
          "product_id=" + productId,
        ];

        navigate("/subscriptions/payment?" + searchParams.join("&"), {
          replace: true,
          state: {
            error: new ErrorWarning("Something went wrong."),
          },
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
      <ErrorLayout
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
