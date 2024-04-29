import {
  ClipboardIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { SVGProps, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { NotificationAlert } from "../components/Alerts";
import { RevokeButton, SubmitButton } from "../components/Buttons";
import Loading from "../components/Loading";
import SidebarItem from "../components/SidebarItem";
import Warnings from "../components/Warnings";
import ErrorLayout from "../components/layouts/ErrorLayout";
import Layout from "../components/layouts/Layout";
import { useNotifications } from "../hooks/useNotifications";
import { ErrorWarning, useWarnings } from "../hooks/useWarnings";
import { useAuth } from "../provider/authProvider";
import { Breadcrumb } from "../types/Breadcrumb";
import { Subscription } from "../types/Subscription";
import { callAPI } from "../utils/apiService";
import { formatUnixDate, formatUnixDateTime } from "../utils/formatUnixDate";

const SETTINGS_PAGES = {
  ACCOUNT: "account",
  BILLING_HISTORY: "billing-history",
  SUBSCRIPTION: "subscription",
} as const;

type ObjectValues<T> = T[keyof T];
type SettingsPage = ObjectValues<typeof SETTINGS_PAGES>;

function isSettingsPage(page: string): page is SettingsPage {
  return Object.values(SETTINGS_PAGES).includes(page as SettingsPage);
}

type MutationParams = {
  id: string;
};

type NavigationItem = {
  id: SettingsPage;
  title: string;
  Icon: React.FC<SVGProps<SVGElement>>;
};

type SettingsContentProps = {
  page: SettingsPage;
  subscription: Subscription | null;
  cancelLoading: boolean;
  payLoading: boolean;
  onCancelSubscription: () => void;
  onPayInvoice: () => void;
};

const navigation: Array<NavigationItem> = [
  {
    id: SETTINGS_PAGES.ACCOUNT,
    title: "Account",
    Icon: UserCircleIcon as React.FC<SVGProps<SVGElement>>,
  },
  {
    id: SETTINGS_PAGES.BILLING_HISTORY,
    title: "Billing history",
    Icon: ClipboardIcon as React.FC<SVGProps<SVGElement>>,
  },
  {
    id: SETTINGS_PAGES.SUBSCRIPTION,
    title: "Subscription",
    Icon: KeyIcon as React.FC<SVGProps<SVGElement>>,
  },
];

const SettingsContent: React.FC<SettingsContentProps> = ({
  page,
  subscription,
  cancelLoading,
  payLoading,
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
                      <RevokeButton
                        title="Cancel"
                        loading={cancelLoading}
                        onPress={onCancelSubscription}
                      />
                      {subscription.status === "past_due" && (
                        <SubmitButton
                          title="Pay now"
                          loading={payLoading}
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
                          Start a subscription
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

export default function Settings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, signNewToken } = useAuth();
  if (!user) return null;

  const { warnings, pushWarning, removeWarning, clearWarnings } = useWarnings();
  const { notification } = useNotifications();

  const subscription = user.subscription;
  const hasSubscription = subscription.status !== null;

  const pageProp = searchParams.get("page");
  const defaultPage: SettingsPage =
    pageProp && isSettingsPage(pageProp)
      ? (pageProp as SettingsPage)
      : SETTINGS_PAGES.ACCOUNT;

  const [page, setPage] = useState<SettingsPage>(defaultPage);

  const { data, error, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: () =>
      callAPI<Subscription>("/subscriptions/find", {
        id: subscription.subscription_id,
      }),
    enabled: hasSubscription,
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id }: MutationParams) =>
      callAPI("/subscriptions/cancel", { id }),
    onSuccess: () => {
      signNewToken().then(() => {
        const notification = {
          title: "Success!",
          message: "Your subscription has been canceled.",
        };

        navigate(".?page=" + page, { replace: true, state: { notification } });
      });
    },
    onError: (err: Error) => {
      pushWarning(new ErrorWarning(err.message));
    },
  });

  const payMutation = useMutation({
    mutationFn: ({ id }: MutationParams) =>
      callAPI("/subscriptions/pay", { id }),
    onSuccess: () => {
      signNewToken().then(() => {
        const notification = {
          title: "Success!",
          message: "Your subscription has been payed.",
        };

        navigate(".?page=" + page, { replace: true, state: { notification } });
      });
    },
    onError: (err: Error) => {
      pushWarning(new ErrorWarning(err.message));
    },
  });

  const handleCancelSubscription = async () => {
    if (!hasSubscription || data === undefined) return;
    clearWarnings();
    cancelMutation.mutate({ id: data.id });
  };

  const handlePayInvoice = async () => {
    if (!hasSubscription || data === undefined) return;
    clearWarnings();
    payMutation.mutate({ id: data.id });
  };

  const changePage = (to: SettingsPage) => {
    setSearchParams({ page: to });
    setPage(to);
  };

  const pageTitle =
    navigation.find((item) => item.id === page)?.title ?? "Account";

  const breadcrumb: Breadcrumb = [{ title: "Settings" }, { title: pageTitle }];

  if (error !== null)
    return <ErrorLayout breadcrumb={breadcrumb} error={error} />;
  if (isLoading || (hasSubscription && data === undefined)) return <Loading />;

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="flex gap-8 w-full pt-6">
        <div className="flex w-full max-w-[20rem] flex-col bg-clip-border py-4 text-gray-700">
          <nav className="flex flex-col p-2 text-base">
            {navigation.map((item) => (
              <SidebarItem
                {...item}
                key={item.id}
                current={page}
                onPress={() => changePage(item.id)}
              />
            ))}
          </nav>
        </div>

        <div className="flex-1 py-4">
          <SettingsContent
            page={page}
            subscription={hasSubscription && data ? data : null}
            cancelLoading={cancelMutation.isPending}
            payLoading={payMutation.isPending}
            onCancelSubscription={handleCancelSubscription}
            onPayInvoice={handlePayInvoice}
          />
        </div>
      </div>

      <Warnings list={warnings} onClose={(item) => removeWarning(item)} />

      <NotificationAlert item={notification} />
    </Layout>
  );
}
