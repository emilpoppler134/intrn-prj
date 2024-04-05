import {
  ClipboardIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import React, { SVGProps, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import SubmitButton from "../components/SubmitButton";
import Layout from "../components/layouts/Layout";
import { FormHook, useForm } from "../hooks/useForm";
import { useAuth } from "../provider/authProvider";
import { ResponseStatus, ValidDataResponse } from "../types/ApiResponses";
import { Breadcrumb } from "../types/Breadcrumb";
import { Subscription } from "../types/Subscription";
import { callAPI } from "../utils/apiService";
import { dynamicClassNames } from "../utils/dynamicClassNames";
import { formatUnixDate, formatUnixDateTime } from "../utils/formatUnixDate";

const SETTINGS_PAGES = {
  ACCOUNT: "account",
  BILLING_HISTORY: "billing-history",
  SUBSCRIPTION: "subscription",
} as const;

type ObjectValues<T> = T[keyof T];
type SettingsPages = ObjectValues<typeof SETTINGS_PAGES>;

function isSettingsPage(page: string): page is SettingsPages {
  return Object.values(SETTINGS_PAGES).includes(page as SettingsPages);
}

type NavigationItem = {
  name: string;
  icon: React.FC<SVGProps<SVGElement>>;
  to: SettingsPages;
};

type SettingsContentProps = {
  page: SettingsPages;
  subscription: Subscription | null;
  cancelSubscriptionForm: FormHook;
  payInvoiceForm: FormHook;
  onCancelSubscription: () => Promise<void>;
  onPayInvoice: () => Promise<void>;
};

const SettingsContent: React.FC<SettingsContentProps> = ({
  page,
  subscription,
  cancelSubscriptionForm,
  payInvoiceForm,
  onCancelSubscription,
  onPayInvoice,
}) => {
  switch (page) {
    case SETTINGS_PAGES.ACCOUNT: {
      return <span>Account</span>;
    }

    case SETTINGS_PAGES.BILLING_HISTORY: {
      return <span>Billing history</span>;
    }

    case SETTINGS_PAGES.SUBSCRIPTION: {
      return (
        <>
          {subscription ? (
            <div className="w-full max-w-2xl mx-auto">
              <div className="rounded-lg shadow bg-white">
                <div className="flex flex-col px-4 py-6 lg:px-6">
                  <div className="flex justify-between gap-x-6 pb-4 border-b border-gray-100">
                    <div className="flex gap-x-4">
                      <div className="h-12 w-12 p-3 rounded-full">
                        <KeyIcon
                          className="w-full h-full fill-gray-700"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold leading-6 text-gray-900">
                            {subscription.name}
                          </span>
                          {subscription.status === "active" ? (
                            <span className="px-1.5 py-0.5 text-xs font-medium rounded-md text-green-700 bg-green-50 ring-1 ring-inset ring-green-600/20">
                              Active
                            </span>
                          ) : subscription.status === "past_due" ? (
                            <span className="px-1.5 py-0.5 text-xs font-medium rounded-md text-yellow-700 bg-yellow-50 ring-1 ring-inset ring-yellow-600/20">
                              Past due
                            </span>
                          ) : null}
                        </div>
                        <span className="block truncate text-xs leading-5 text-gray-500">
                          {subscription.price} SEK /mo
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between w-full max-w-52">
                      <div className="flex flex-col text-sm leading-6 text-gray-700">
                        <span>Current period</span>
                        <span>Created</span>
                      </div>
                      <div className="flex flex-col text-sm leading-6 text-gray-500">
                        <span>
                          {formatUnixDate(subscription.current_period_start)} -{" "}
                          {formatUnixDate(subscription.current_period_end)}
                        </span>
                        <span>{formatUnixDateTime(subscription.created)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col items-start">
                    <span className="text-base leading-6 font-semibold text-gray-900">
                      Manage subscription
                    </span>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                      <span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolorem neque iusto aspernatur cumque consectetur!
                      </span>
                    </div>
                    <div className="flex gap-4 mt-5">
                      <SubmitButton
                        text="Cancel"
                        color="red"
                        fullWidth={false}
                        form={cancelSubscriptionForm}
                        onPress={onCancelSubscription}
                      />
                      {subscription.status !== "past_due" ? null : (
                        <SubmitButton
                          text="Pay now"
                          fullWidth={false}
                          form={payInvoiceForm}
                          onPress={onPayInvoice}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto">
              <div className="rounded-lg shadow bg-white">
                <div className="flex flex-col items-center py-12">
                  <span className="block text-lg">No subscription</span>
                  <div className="mt-4">
                    <Link to="/subscriptions">
                      <div className="px-4 py-2 rounded-md shadow-md bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:bg-primary-300">
                        <span className="text-sm font-semibold text-white pointer-events-none">
                          Start a subscription.
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    default: {
      return <span>Something went wrong.</span>;
    }
  }
};

const navigation: Array<NavigationItem> = [
  {
    name: "Account",
    to: SETTINGS_PAGES.ACCOUNT,
    icon: UserCircleIcon as React.FC<SVGProps<SVGElement>>,
  },
  {
    name: "Billing history",
    to: SETTINGS_PAGES.BILLING_HISTORY,
    icon: ClipboardIcon as React.FC<SVGProps<SVGElement>>,
  },
  {
    name: "Subscription",
    to: SETTINGS_PAGES.SUBSCRIPTION,
    icon: KeyIcon as React.FC<SVGProps<SVGElement>>,
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, signNewToken } = useAuth();

  const cancelSubscriptionForm = useForm();
  const payInvoiceForm = useForm();

  const pageProp = searchParams.get("page");

  const defaultPage: SettingsPages =
    pageProp && isSettingsPage(pageProp)
      ? (pageProp as SettingsPages)
      : SETTINGS_PAGES.ACCOUNT;

  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb>([
    { title: "Settings" },
    { title: "Account" },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<SettingsPages>(defaultPage);
  const [subscription, setSubscription] = useState<
    Subscription | null | undefined
  >(undefined);

  useEffect(() => {
    if (!user) return;

    if (user.subscription.subscription_id === null) {
      setSubscription(null);
      return;
    }

    callAPI<Subscription>("/subscriptions/find", {
      id: user.subscription.subscription_id,
    }).then((response) => {
      if (response === null || response.status === ResponseStatus.ERROR) {
        setError("Something went wrong with the subscription.");
        setSubscription(null);
        return;
      }

      const validDataResponse = response as ValidDataResponse & {
        data: Subscription;
      };

      setSubscription(validDataResponse.data);
    });
  }, [user]);

  if (!user) return null;

  const handlePageChange = (item: NavigationItem) => {
    setBreadcrumb([{ title: "Settings" }, { title: item.name }]);
    setSearchParams({ page: item.to });
    setPage(item.to);
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    const response = await callAPI("/subscriptions/cancel", {
      id: subscription.id,
    });

    if (response === null || response.status === ResponseStatus.ERROR) {
      setError("Something went wrong with the subscription.");
      return;
    }

    await signNewToken();

    const notification = {
      title: "Success!",
      message: "Your subscription has been canceled.",
    };
    navigate(".", { replace: true, state: { notification } });
  };

  const handlePayInvoice = async () => {
    if (!subscription) return;

    const response = await callAPI("/subscriptions/pay", {
      id: subscription.id,
    });

    if (response === null || response.status === ResponseStatus.ERROR) {
      setError("Something went wrong with the payment.");
      return;
    }

    await signNewToken();

    const notification = {
      title: "Success!",
      message: "Your subscription has been payed.",
    };
    navigate(".", { replace: true, state: { notification } });
  };

  if (subscription === undefined) return <Loading />;

  return (
    <Layout
      breadcrumb={breadcrumb}
      error={error}
      onErrorClose={() => setError(null)}
    >
      <div className="flex gap-8 w-full">
        <div className="flex w-full max-w-[20rem] flex-col bg-clip-border py-4 text-gray-700">
          <nav className="flex flex-col p-2 text-base">
            {navigation.map((item) => (
              <button
                key={item.name}
                className={dynamicClassNames(
                  item.to === page ? "bg-primary-100 hover:bg-primary-100" : "",
                  "flex items-center w-full p-3 leading-tight rounded-lg text-start hover:bg-gray-100"
                )}
                onClick={() => handlePageChange(item)}
              >
                <div className="grid mr-4 place-items-center">
                  <item.icon className="block w-6 h-6" aria-hidden="true" />
                </div>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 py-4">
          <SettingsContent
            page={page}
            subscription={subscription}
            cancelSubscriptionForm={cancelSubscriptionForm}
            payInvoiceForm={payInvoiceForm}
            onCancelSubscription={handleCancelSubscription}
            onPayInvoice={handlePayInvoice}
          />
        </div>
      </div>
    </Layout>
  );
}
