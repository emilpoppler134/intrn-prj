import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { STRIPE_PUBLIC_KEY } from '../config';
import { useAuth } from '../provider/authProvider';
import { callAPI } from '../utils/apiService';
import { ResponseStatus, ValidDataResponse } from '../types/ApiResponses';
import { PaymentIntent } from '../types/PaymentIntent';
import { Product } from '../types/Product';
import { Breadcrumb } from '../types/Breadcrumb';
import Layout from '../components/Layout';
import PaymentForm from '../components/PaymentForm';
import Loading from '../components/Loading';
import PaymentResult from '../components/PaymentResult';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default function Payment() {
  const navigate = useNavigate();
  const { state, pathname, search } = useLocation();
  const { signNewToken } = useAuth();

  const resultCallback = pathname.includes('/result');
  const clientSecretProp = new URLSearchParams(search).get('payment_intent_client_secret');
  const productIdProp = new URLSearchParams(search).get('productId');

  const [error, setError] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null | undefined>(undefined);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    if (resultCallback || !state || !state.paymentIntent) {
      setPaymentIntent(null);
    } else {
      setPaymentIntent(state.paymentIntent);
      window.history.replaceState({}, '');
    }
  }, [resultCallback, state]);

  useEffect(() => {
    if (!resultCallback && (!state || !state.paymentIntent)) {
      setProduct(null);
      return;
    }

    const id = resultCallback ? productIdProp : state.paymentIntent.productId;

    callAPI<Product>("/products/find", { id })
      .then(response => {
        if (response === null || response.status === ResponseStatus.ERROR) {
          setProduct(null);
          return;
        }

        const validDataResponse = response as ValidDataResponse & { data: Product };

        setProduct(validDataResponse.data);
      });
  }, [resultCallback, productIdProp, state]);

  const callback = async (status: string) => {
    switch (status) {
      case 'succeeded': {
        const response = await callAPI("/subscriptions/confirm");

        if (response === null || response.status === ResponseStatus.ERROR) {
          const error = {
            message: "Something went wrong. Please try signing out and signing in again."
          }
          navigate("/dashboard/", {replace: true, state: { error }});
          return;
        }

        await signNewToken();

        const notification = {
          title: "Success!",
          message: "Your subscription has been activated."
        }
        navigate("/dashboard", {replace: true, state: { notification }});
        break;
      }

      case 'requires_payment_method': {
        const error = {
          message: "Payment failed. Please try another payment method."
        }
        navigate("/subscriptions/payment", {replace: true, state: { error, paymentIntent: { productId: productIdProp, clientSecret: clientSecretProp }}});
        break;
      }

      default: {
        const error = {
          message: "Something went wrong."
        }
        navigate("/subscriptions/payment", {replace: true, state: { error, paymentIntent: { productId: productIdProp, clientSecret: clientSecretProp }}});
        break;
      }
    }
  }

  const breadcrumb: Breadcrumb = [
    { title: "Subscriptions", to: "/subscriptions" },
    { title: "Payment" }
  ];

  if ((!stripePromise) || (product === null) || (resultCallback && (clientSecretProp === null || productIdProp === null)) || (!resultCallback && paymentIntent === null)) return (
    <Layout breadcrumb={breadcrumb} error={"Something went wrong."} />
  )
  if ((!resultCallback && paymentIntent === undefined) || product === undefined) return (
    <Loading />
  );

  const clientSecret = resultCallback 
    ?
      clientSecretProp ?? undefined
    :
    paymentIntent ? paymentIntent.clientSecret : undefined;

  return (
    <Layout
      breadcrumb={breadcrumb}
      error={error}
      onErrorClose={() => setError(null)}
    >
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        {!resultCallback ?
          paymentIntent && <PaymentForm product={product} />
        :
          clientSecretProp && <PaymentResult clientSecret={clientSecretProp} callback={callback} />
        }
      </Elements>
    </Layout>
  )
}
