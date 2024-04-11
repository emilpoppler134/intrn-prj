import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useForm } from "../hooks/useForm";
import SubmitButton from "./SubmitButton";

type PaymentFormProps = {
  return_url: string;
};

const PaymentForm: React.FC<PaymentFormProps> = ({ return_url }) => {
  const stripe = useStripe();
  const elements = useElements();
  const form = useForm();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

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
  };

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div className="mt-4">
        <PaymentElement />
      </div>

      {!errorMessage ? null : (
        <div className="mt-4">
          <span className="text-red-600">{errorMessage}</span>
        </div>
      )}

      <div className="mt-8">
        <SubmitButton text="Confirm" form={form} onPress={handleSubmit} />
      </div>
    </form>
  );
};

export default PaymentForm;
