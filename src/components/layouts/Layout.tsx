import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon, UserIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import React, { Fragment, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_ADDRESS } from "../../config";
import { useAuth } from "../../provider/authProvider";
import { Breadcrumb } from "../../types/Breadcrumb";
import { ExtendedError } from "../../utils/ExtendedError";
import ErrorAlert from "./../ErrorAlert";
import Notification from "./../Notification";

type StateContent = {
  stateError: StateErrorProps | null;
  notification: NotificationProps | null;
};

type StateErrorProps = {
  message: string;
};

type NotificationProps = {
  title: string;
  message: string;
};

type LayoutProps = {
  children?: ReactNode;
  breadcrumb?: Breadcrumb;
  error?: Error | null;
  onErrorClose?: () => void;
};

const navigation = [{ name: "Dashboard", href: "/dashboard", current: true }];

const Layout: React.FC<LayoutProps> = ({
  children,
  breadcrumb,
  error,
  onErrorClose,
}) => {
  const { state } = useLocation();

  const { user, setToken } = useAuth();
  if (!user) return null;

  const { stateError, notification } = ((): StateContent => {
    if (!state) return { stateError: null, notification: null };

    const stateError = state.error;
    const notification = state.notification;

    window.history.replaceState({}, "");

    return { stateError, notification };
  })();

  const handleLogout = async () => {
    setToken(null);
  };

  const handleErrorClose = () => {
    onErrorClose?.();
  };

  const extendedError =
    error instanceof ExtendedError
      ? error
      : error && new ExtendedError(error.message);

  if (breadcrumb === undefined) {
    breadcrumb = [{ title: "Error" }];
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Disclosure as="nav" className="bg-gray-800 z-20">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link to="/dashboard" className="-m-1.5 p-1.5">
                        <span className="sr-only">Netlight</span>
                        <img
                          className="h-12 w-auto"
                          src={`${API_ADDRESS}/images/logo_icon.png`}
                          alt="Logo"
                        />
                      </Link>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              { "bg-gray-900 text-white": item.current },
                              {
                                "hover:bg-gray-700 text-gray-300 hover:text-white":
                                  !item.current,
                              },
                              "rounded-md px-3 py-2 text-sm font-medium",
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center bg-gray-800 text-sm">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <UserIcon
                              className="w-6 h-6 fill-white"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="flex items-center px-4 py-2">
                              <div className="flex flex-col">
                                <div className="text-base font-medium leading-none text-black">
                                  {user.name}
                                </div>
                                <div className="mt-2 text-sm font-medium leading-none text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/settings"
                                  className={classNames(
                                    { "bg-gray-100": active },
                                    "block px-4 py-2 text-sm text-gray-700",
                                  )}
                                >
                                  <span className="select-none">Settings</span>
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleLogout}
                                  className={classNames(
                                    { "bg-gray-100": active },
                                    "block w-full px-4 py-2 text-sm text-left text-gray-700",
                                  )}
                                >
                                  <span className="select-none">Sign out</span>
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        { "bg-gray-900 text-white": item.current },
                        {
                          "text-gray-300 hover:bg-gray-700 hover:text-white":
                            !item.current,
                        },
                        "block rounded-md px-3 py-2 text-base font-medium",
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <UserIcon
                        className="w-6 h-6 fill-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user.name}
                      </div>
                      <div className="mt-1 text-sm font-medium leading-none text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Link
                      to="/profile"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      <span className="select-none">Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      <span className="select-none">Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      <span className="select-none">Sign out</span>
                    </button>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main className="flex-1 flex flex-col overflow-auto bg-gray-50">
          <header className="bg-white shadow z-10">
            <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center hover:underline"
                  >
                    <HomeIcon
                      className="w-[20px] h-[20px] mr-3 fill-gray-700"
                      aria-hidden="true"
                    />
                    <span className="text-base font-medium text-gray-700">
                      Home
                    </span>
                  </Link>
                </li>
                {breadcrumb.map((item) => (
                  <li key={item.title}>
                    <div className="flex items-center">
                      <ChevronRightIcon
                        className="w-4 h-4 mx-1 stroke-gray-400 stroke-2"
                        aria-hidden="true"
                      />

                      {item.to ? (
                        <Link
                          to={item.to}
                          className="ml-1 text-gray-700 hover:underline md:ml-2"
                        >
                          <span className="text-base font-medium">
                            {item.title}
                          </span>
                        </Link>
                      ) : (
                        <span className="ml-1 cursor-default text-base font-medium text-gray-500 md:ml-2">
                          {item.title}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </header>

          <div className="flex-1 flex justify-center w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 [&>div]:w-full">
            {children}
          </div>
        </main>

        {!extendedError ? null : extendedError.closeable ? (
          <ErrorAlert
            message={extendedError.message}
            onClose={handleErrorClose}
          />
        ) : (
          <ErrorAlert message={extendedError.message} />
        )}

        {!stateError ? null : <ErrorAlert message={stateError.message} />}

        {!notification ? null : (
          <Notification
            title={notification.title}
            message={notification.message}
          />
        )}
      </div>
    </>
  );
};

export default Layout;
