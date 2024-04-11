import { UserIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Link } from "react-router-dom";
import { Bot } from "../types/Bot";

type BotItemProps = {
  bot: Bot;
};

const BotItem: React.FC<BotItemProps> = ({ bot }) => {
  return (
    <div className="flex flex-col">
      <Link to={`/bots/${bot.id}`} className="group">
        <div className="mb-1">
          <span className="text-base text-gray-700">{bot.name}</span>
        </div>
        <div className="flex flex-col">
          <div className="relative pb-[100%] outline outline-2 outline-gray-300">
            <div className="absolute-center w-full h-full p-4">
              <UserIcon
                className="w-full h-full fill-gray-700"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-base font-medium text-primary-600 group-hover:underline dark:text-primary-500">
              Chat
            </span>
          </div>
        </div>
      </Link>
      <Link to={`/bots/${bot.id}/config`}>
        <span className="text-base font-medium text-primary-600 hover:underline dark:text-primary-500">
          Config
        </span>
      </Link>
    </div>
  );
};

export default BotItem;
