import {
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { Bot } from "../types/Bot";

type BotItemProps = {
  bot: Bot;
  disabled?: boolean;
};

const BotItem: React.FC<BotItemProps> = ({ bot, disabled = false }) => {
  return (
    <>
      <li
        className={classNames(
          { "pointer-events-none": disabled },
          "col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow",
        )}
      >
        <div className="flex flex-1 flex-col p-8">
          <div className="mx-auto h-32 w-32 flex-shrink-0 rounded-full">
            {bot.photo === null ? (
              <UserIcon
                className="w-full h-full fill-gray-700"
                aria-hidden="true"
              />
            ) : (
              <img src={bot.photo} alt="" className="w-full h-full" />
            )}
          </div>

          <h3 className="mt-6 text-sm font-medium text-gray-900">{bot.name}</h3>
        </div>
        <div>
          <div className="-mt-px flex divide-x divide-gray-200">
            <div className="flex w-0 flex-1">
              <Link
                to={`/bots/${bot.id}/config`}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                <Cog6ToothIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Config
              </Link>
            </div>
            <div className="-ml-px flex w-0 flex-1">
              <Link
                to={`/bots/${bot.id}`}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                <ChatBubbleBottomCenterTextIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Chat
              </Link>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default BotItem;
