import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import PaymentForm from "../components/PaymentForm";
import Layout from "../components/layouts/Layout";
import { APP_ADDRESS, STRIPE_PUBLIC_KEY } from "../config";
import { Breadcrumb } from "../types/Breadcrumb";
import { Product } from "../types/Product";
import { callAPI } from "../utils/apiService";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default function Payment() {
  const { search } = useLocation();

  const clientSecret = new URLSearchParams(search).get(
    "payment_intent_client_secret",
  );
  const productId = new URLSearchParams(search).get("product_id");

  if (!clientSecret || !productId) return null;

  const { data, isLoading, error } = useQuery({
    queryKey: ["product"],
    queryFn: () => callAPI<Product>("/products/find", { id: productId }),
  });

  const breadcrumb: Breadcrumb = [
    { title: "Subscriptions", to: "/subscriptions" },
    { title: "Payment" },
  ];

  if (!stripePromise || clientSecret === null || productId === null) {
    return (
      <Layout
        breadcrumb={breadcrumb}
        error={new Error("Something went wrong.")}
      />
    );
  }

  if (error !== null) return <Layout breadcrumb={breadcrumb} error={error} />;
  if (isLoading || data === undefined) return <Loading />;

  return (
    <Layout breadcrumb={breadcrumb}>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <div className="app-payment flex justify-between w-full max-w-4xl mx-auto">
          <div className="w-full max-w-96">
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-600">{data.name}</p>
              <p className="mt-2 flex items-baseline justify-start gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  {data.price} SEK
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                  /mo
                </span>
              </p>
            </div>
          </div>
          <div className="w-full max-w-96 z-10">
            <PaymentForm
              return_url={`${APP_ADDRESS}/subscriptions/payment/result?product_id=${data.id}`}
            />
          </div>
        </div>
      </Elements>
    </Layout>
  );
}
