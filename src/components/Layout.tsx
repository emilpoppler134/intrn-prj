import React, { Fragment, ReactNode, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import { API_ADDRESS } from '../config';
import { dynamicClassNames } from '../utils/dynamicClassNames';
import { useAuth } from '../provider/authProvider';

import ErrorAlert from './ErrorAlert';

type Props = {
  children: ReactNode;
  title: string;
}

const navigation = [
  { name: 'Overview', href: '/dashboard', current: true }
]

const Layout: React.FC<Props> = ({ children, title }) => {
  const navigate = useNavigate();
  const { user, token, setToken } = useAuth();

  const [error, setError] = useState<string | null>(null);

  if (user === null) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleLogout = async () => {
    const response = await fetchLogout();

    if (response === null) {
      setError("Unable to sign out. Please try again later.")
      return;
    }

    setToken(null);
  }

  const fetchLogout = async (): Promise<true | null> => {
    try {
      const body = {
        token
      }

      await axios.post(`${API_ADDRESS}/users/logout`, body);

      return true;
    } catch(err) { return null; }
  }

  if (user === undefined) {
    return (
      <div className="theme-spinner"></div>
    )
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link to="/dashboard" className="-m-1.5 p-1.5">
                        <span className="sr-only">Netlight</span>
                        <img className="h-12 w-auto" src={`${API_ADDRESS}/images/logo_icon.png`} alt="Logo" />
                      </Link>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={dynamicClassNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
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
                            <div className="h-5 w-5 text-white">
                              <svg className="h-full w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                              </svg>
                            </div>
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
                                <div className="text-base font-medium leading-none text-black">{ user.name }</div>
                                <div className="mt-2 text-sm font-medium leading-none text-gray-400">{ user.email }</div>
                              </div>
                            </div>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/settings"
                                  className={dynamicClassNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
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
                                  className={dynamicClassNames(
                                    active ? 'bg-gray-100' : '',
                                    'block w-full px-4 py-2 text-sm text-left text-gray-700'
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
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
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
                      className={dynamicClassNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <div className="h-5 w-5 text-white">
                        <svg className="h-full w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{ user.name }</div>
                      <div className="mt-1 text-sm font-medium leading-none text-gray-400">{ user.email }</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Link to="/profile" className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                      <span className="select-none">Profile</span>
                    </Link>
                    <Link to="/settings" className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                      <span className="select-none">Settings</span>
                    </Link>
                    <button onClick={handleLogout} className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                      <span className="select-none">Sign out</span>
                    </button>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{ title }</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            { children }
          </div>
        </main>

        {error === null ? null :
          <ErrorAlert message={error} onClose={() => setError(null)} />
        }
      </div>
    </>
  )
}

export default Layout;
