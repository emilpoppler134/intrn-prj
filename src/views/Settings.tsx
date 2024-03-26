import React, { useState } from 'react';
import { UserCircleIcon, CreditCardIcon, ClipboardIcon, KeyIcon } from '@heroicons/react/24/solid'

import { dynamicClassNames } from '../utils/dynamicClassNames';
import { Breadcrumb } from '../types/Breadcrumb';
import Layout from "../components/Layout";

enum SettingsPages {
  Account,
  PaymentOptions,
  BillingHistory,
  Subscription
}

type SettingsContentProps = {
  page: SettingsPages;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ page }) => {
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
        <span>Subscription</span>
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
  const [page, setPage] = useState<SettingsPages>(SettingsPages.Account);

  const breadcrumb: Breadcrumb = [
    { title: "Settings" }
  ];

  return (
    <Layout breadcrumb={breadcrumb} backgroundColor="white">
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
          <SettingsContent page={page} />
        </div>
      </div>
    </Layout>
  )
}