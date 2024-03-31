import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

import { useForm } from '../hooks/useForm';
import { Product } from '../types/Product';
import SubmitButton from './SubmitButton';

type PaymentFormProps = {
  product: Product;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ product }) => {
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
        return_url: `http://localhost:3000/subscriptions/payment/result?productId=${product.id}`,
      }
    });

    if (response.error) {
      setErrorMessage(response.error.message ?? "Something went wrong");
    }
  }

  return (
    <div className="app-payment flex justify-between w-full max-w-4xl mx-auto">
      <div className="w-full max-w-96">
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-600">{ product.name }</p>
          <p className="mt-2 flex items-baseline justify-start gap-x-2">
            <span className="text-5xl font-bold tracking-tight text-gray-900">{ product.price } SEK</span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">/mo</span>
          </p>
        </div>
      </div>
      <div className="w-full max-w-96 z-10">
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="mt-4">
            <PaymentElement />
          </div>

          {!errorMessage ? null :
            <div className="mt-4">
              <span className="text-red-600">{errorMessage}</span>
            </div>
          }

          <div className="mt-8">
            <SubmitButton
              text="Confirm"
              form={form}
              onPress={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentForm;