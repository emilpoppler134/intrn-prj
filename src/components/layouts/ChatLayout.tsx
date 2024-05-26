import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronRightIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, HomeIcon } from "@heroicons/react/24/solid";
import { Fragment, ReactNode, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Chat } from "../../types/Chat";
import SidebarChatList from "../SidebarChatList";

type ChatLayoutProps = {
  data: { chat: Chat; list: Array<Chat> };
  onNavigate: (to: string) => void;
  onRemove: (id: string) => void;
  onCreate: () => void;
  children: ReactNode;
};

const ChatLayout: React.FC<ChatLayoutProps> = ({
  data,
  onNavigate,
  onCreate,
  onRemove,
  children,
}) => {
  const { bot, chat } = useParams();

  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-1">
      <Transition.Root show={open} as={Fragment}>
        <Dialog className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 pb-4 pt-8 ring-1 ring-white/10">
                  <nav className="flex flex-1 flex-col">
                    <ul
                      role="list"
                      className="flex flex-1 flex-col gap-y-7 px-3"
                    >
                      <li>
                        <SidebarChatList
                          list={data.list}
                          current={chat}
                          onNavigate={onNavigate}
                          onCreate={onCreate}
                          onRemove={onRemove}
                          onPress={() => setOpen(false)}
                        />
                      </li>
                      <li className="mt-auto">
                        <Link
                          to={`/bots/${bot}/config`}
                          className="group flex gap-x-3 rounded-md px-2 py-4 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                        >
                          <Cog6ToothIcon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          Config
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 pb-4 pt-8">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7 px-3">
              <li>
                <SidebarChatList
                  list={data.list}
                  current={chat}
                  onNavigate={onNavigate}
                  onCreate={onCreate}
                  onRemove={onRemove}
                  onPress={() => setOpen(false)}
                />
              </li>
              <li className="mt-auto">
                <Link
                  to={`/bots/${bot}/config`}
                  className="group flex gap-x-3 rounded-md px-2 py-3 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <Cog6ToothIcon
                    className="h-6 w-6 shrink-0"
                    aria-hidden="true"
                  />
                  Config
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <header className="bg-white shadow z-10">
          <div className="flex items-center w-full px-4 py-4 sm:px-6 lg:px-8">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center mr-4 lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-700"
                  onClick={() => setOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon
                    className="h-6 w-6 text-gray-700"
                    aria-hidden="true"
                  />
                </button>
              </li>
              <li className="inline-flex items-center">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center hover:underline"
                >
                  <HomeIcon
                    className="w-[20px] h-[20px] mr-3 fill-gray-700 hidden xs:block"
                    aria-hidden="true"
                  />
                  <span className="text-base font-medium text-gray-700">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon
                    className="w-4 h-4 mx-1 stroke-gray-400 stroke-2"
                    aria-hidden="true"
                  />
                  <span className="ml-1 cursor-default text-base font-medium text-gray-500 md:ml-2">
                    {data.chat.bot.name}
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon
                    className="w-4 h-4 mx-1 stroke-gray-400 stroke-2"
                    aria-hidden="true"
                  />
                  <span className="ml-1 cursor-default text-base font-medium text-gray-500 md:ml-2">
                    {data.chat.name}
                  </span>
                </div>
              </li>
            </ol>
          </div>
        </header>

        <main className="h-full relative">
          <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full">
            <div className="flex flex-col h-full">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
