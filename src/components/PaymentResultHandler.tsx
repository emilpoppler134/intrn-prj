import { useStripe } from "@stripe/react-stripe-js";
import { useEffect } from "react";

type PaymentResultHandlerProps = {
  clientSecret: string;
  callback: (status: string) => void;
};

const PaymentResultHandler: React.FC<PaymentResultHandlerProps> = ({
  clientSecret,
  callback,
}) => {
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

export default PaymentResultHandler;
