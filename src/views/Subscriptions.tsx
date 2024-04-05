import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import SubmitButton from "../components/SubmitButton";
import Layout from "../components/layouts/Layout";
import { FormValues, useForm } from "../hooks/useForm";
import { useAuth } from "../provider/authProvider";
import {
  ErrorType,
  ResponseStatus,
  ValidDataResponse,
} from "../types/ApiResponses";
import { Breadcrumb } from "../types/Breadcrumb";
import { PaymentIntent } from "../types/PaymentIntent";
import { Product } from "../types/Product";
import { callAPI } from "../utils/apiService";

export default function Subscriptions() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm([[{ key: "productId", validation: null }]]);

  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Array<Product> | null | undefined>(
    undefined,
  );

  useEffect(() => {
    callAPI<Array<Product>>("/products/list").then((response) => {
      if (response === null || response.status === ResponseStatus.ERROR) {
        setProducts(null);
        setError("Something went wrong.");
        return;
      }

      const validDataResponse = response as ValidDataResponse & {
        data: Array<Product>;
      };

      setProducts(validDataResponse.data);
    });
  }, [user]);

  const handleCreatePaymentIntent = async ({ productId }: FormValues) => {
    const response = await callAPI<PaymentIntent>(
      "/subscriptions/create-payment-intent",
      { id: productId },
    );

    if (response === null) {
      setError("Something went wrong when the request was sent.");
      return;
    }

    if (response.status === ResponseStatus.ERROR) {
      switch (response.error) {
        case ErrorType.ALREADY_EXISTING: {
          setError(
            "You already have an active subscription. Cancel it to start a new one.",
          );
          return;
        }

        default: {
          setError("Something went wrong.");
          return;
        }
      }
    }

    const validDataResponse = response as ValidDataResponse & {
      data: PaymentIntent;
    };

    navigate("/subscriptions/payment", {
      state: { paymentIntent: validDataResponse.data },
    });
  };

  if (!user) return null;
  if (products === null) return <Layout breadcrumb={null} error={error} />;
  if (products === undefined) return <Loading />;

  const breadcrumb: Breadcrumb = [{ title: "Subscriptions" }];

  return (
    <Layout
      breadcrumb={breadcrumb}
      error={error}
      onErrorClose={() => setError(null)}
    >
      <div className="mx-auto max-w-2xl">
        {products.map((product) => (
          <div
            key={product.id}
            className="-mt-2 mx-auto p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0"
          >
            <div
              className="rounded-2xl bg-white py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16"
              onMouseOver={() => form.setValue("productId", product.id)}
            >
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">
                  {product.name}
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    {product.price} SEK
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    /mo
                  </span>
                </p>
                <div className="mt-10">
                  <SubmitButton
                    text="Choose"
                    form={form}
                    onPress={handleCreatePaymentIntent}
                  />
                </div>
                <p className="mt-6 text-xs leading-5 text-gray-600">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
