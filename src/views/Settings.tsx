import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, CreditCardIcon, ClipboardIcon, KeyIcon } from '@heroicons/react/24/solid'

import { dynamicClassNames } from '../utils/dynamicClassNames';
import { useAuth } from '../provider/authProvider';
import { callAPI } from '../utils/apiService';
import { ResponseStatus, ValidDataResponse } from '../types/ApiResponses';
import { Breadcrumb } from '../types/Breadcrumb';
import { Subscription } from '../types/Subscription';
import Layout from "../components/Layout";
import Loading from '../components/Loading';

enum SettingsPages {
  Account,
  PaymentOptions,
  BillingHistory,
  Subscription
}

type SettingsContentProps = {
  page: SettingsPages;
  subscription: Subscription | null;
  onCancelSubscription: () => Promise<void>;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ page, subscription, onCancelSubscription }) => {
  switch (page) {
    case SettingsPages.Account: {
      return (
        <span>Account</span>
      );
    }

    case SettingsPages.PaymentOptions: {
      return (
        <span>Payment options</span>
      );
    }

    case SettingsPages.BillingHistory: {
      return (
        <span>Billing history</span>
      );
    }

    case SettingsPages.Subscription: {
      return (
        <>
          <p>Subscription</p>
          {subscription ? 
          (
            <div>
              <p>Name: { subscription.name }</p>
              <p>Price: { subscription.price } per month</p>
              <button onClick={onCancelSubscription}>Cancel</button>
            </div>
          )
          :
          (
            <span>
              <span className="mr-1">No subscription.</span>
              <Link to="/subscriptions">
                <span className="underline">Start a subscription.</span>
              </Link>
            </span>
          )
          }
        </>
      );
    }

    default: {
      return (
        <span>Something went wrong.</span>
      )
    }
  }
}

const navigation = [
  { name: 'Account', icon: UserCircleIcon, to: SettingsPages.Account },
  { name: 'Payment options', icon: CreditCardIcon, to: SettingsPages.PaymentOptions },
  { name: 'Billing history', icon: ClipboardIcon, to: SettingsPages.BillingHistory },
  { name: 'Subscription', icon: KeyIcon, to: SettingsPages.Subscription },
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, signNewToken } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<SettingsPages>(SettingsPages.Account);

  const [subscription, setSubscription] = useState<Subscription | null | undefined>(undefined);

  useEffect(() => {
    if (!user) return;

    if (user.subscription.subscription_id === null) {
      setSubscription(null);
      return;
    }

    callAPI<Subscription>("/subscriptions/find", { id: user.subscription.subscription_id })
      .then(response => {
        if (response === null || response.status === ResponseStatus.ERROR) {
          setError("Something went wrong with the subscription.");
          setSubscription(null);
          return;
        }

        const validDataResponse = response as ValidDataResponse & { data: Subscription };

        setSubscription(validDataResponse.data);
      });
  }, [user])

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    const response = await callAPI("/subscriptions/cancel", { id: subscription.id });

    if (response === null || response.status === ResponseStatus.ERROR) {
      setError("Something went wrong with the subscription.");
      return;
    }

    await signNewToken();

    const notification = {
      title: "Success!",
      message: "Your subscription has been canceled."
    }
    navigate(".", {replace: true, state: { notification }});
  }

  const breadcrumb: Breadcrumb = [
    { title: "Settings" }
  ];

  if (subscription === undefined) return <Loading />;

  return (
    <Layout
      breadcrumb={breadcrumb}
      error={error}
      onErrorClose={() => setError(null)}
      backgroundColor="white"
    >
      <div className="flex gap-4 w-full">
        <div className="flex w-full max-w-[20rem] flex-col rounded-xl bg-white bg-clip-border py-4 text-gray-700">
          <nav className="flex flex-col p-2 text-base">
            {navigation.map((item) => (
              <button 
                key={item.name} 
                className={dynamicClassNames(
                  item.to === page ? "bg-primary-100 hover:bg-primary-100" : "",
                  "flex items-center w-full p-3 leading-tight rounded-lg text-start hover:bg-gray-100"
                )}
                onClick={() => setPage(item.to)}
              >
                <div className="grid mr-4 place-items-center">
                  <item.icon className="block w-6 h-6" aria-hidden="true" />
                </div>
                <span>{ item.name }</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex-1 py-4">
          <SettingsContent
            page={page}
            subscription={subscription}
            onCancelSubscription={handleCancelSubscription}
          />
        </div>
      </div>
    </Layout>
  )
}