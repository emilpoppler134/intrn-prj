import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SubmitButton } from "../components/Buttons";
import Loading from "../components/Loading";
import Warnings from "../components/Warnings";
import ErrorLayout from "../components/layouts/ErrorLayout";
import Layout from "../components/layouts/Layout";
import { ErrorWarning, useWarnings } from "../hooks/useWarnings";
import { useAuth } from "../provider/authProvider";
import { Breadcrumb } from "../types/Breadcrumb";
import { PaymentIntent } from "../types/PaymentIntent";
import { Product } from "../types/Product";
import { callAPI } from "../utils/apiService";

type MutationParams = {
  id: string;
};

export default function Subscriptions() {
  const navigate = useNavigate();

  const { user } = useAuth();
  if (!user) return null;

  const { warnings, pushWarning, removeWarning, clearWarnings } = useWarnings();

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => callAPI<Array<Product>>("/products/list"),
  });

  const createMutation = useMutation({
    mutationFn: ({ id }: MutationParams) =>
      callAPI<PaymentIntent>("/subscriptions/create-payment-intent", { id }),
    onSuccess: (response, variables) => {
      const searchParams = [
        "payment_intent_client_secret=" + response.clientSecret,
        "product_id=" + variables.id,
      ];
      navigate("/subscriptions/payment?" + searchParams.join("&"));
    },
    onError: (err: Error) => {
      pushWarning(new ErrorWarning(err.message));
    },
  });

  const onCreatePaymentIntent = async (productId: string) => {
    clearWarnings();
    createMutation.mutate({ id: productId });
  };

  const breadcrumb: Breadcrumb = [{ title: "Subscriptions" }];

  if (error !== null)
    return <ErrorLayout breadcrumb={breadcrumb} error={error} />;
  if (isLoading || data === undefined) return <Loading />;

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="mx-auto max-w-2xl pt-6">
        {data.map((product) => (
          <div
            key={product.id}
            className="-mt-2 mx-auto p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0"
          >
            <div className="rounded-2xl bg-white py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
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
                    title="Choose"
                    loading={createMutation.isPending}
                    onPress={() => onCreatePaymentIntent(product.id)}
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

      <Warnings list={warnings} onClose={(item) => removeWarning(item)} />
    </Layout>
  );
}
