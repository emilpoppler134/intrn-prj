import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { SubmitButton } from "./Buttons";

type PaymentFormProps = {
  return_url: string;
};

const PaymentForm: React.FC<PaymentFormProps> = ({ return_url }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const response = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url,
      },
    });

    if (response.error) {
      setErrorMessage(response.error.message ?? "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className="mt-4">
        <PaymentElement />
      </div>

      {!errorMessage ? null : (
        <div className="mt-4">
          <span className="text-red-600">{errorMessage}</span>
        </div>
      )}

      <div className="mt-8">
        <SubmitButton
          title="Confirm"
          loading={loading}
          onPress={handleSubmit}
        />
      </div>
    </div>
  );
};

export default PaymentForm;
