import { useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";

type PaymentResultProps = {
  clientSecret: string;
  callback: (status: string) => void;
};

const PaymentResult: React.FC<PaymentResultProps> = ({ clientSecret, callback }) => {
  const stripe = useStripe();

  useEffect(() => {
    if (stripe === null || clientSecret === null) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent === undefined) return;

      callback(paymentIntent.status as string);
    });
  }, [stripe, clientSecret, callback]);

  return null;
};

export default PaymentResult;
