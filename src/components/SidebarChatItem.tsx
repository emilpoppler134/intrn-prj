import { TrashIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React from "react";
import { Chat } from "../types/Chat";

type SidebarChatItemProps = {
  chat: Chat;
  current: boolean;
  onNavigate: (id: string) => void;
  onRemove: (id: string) => void;
};

const SidebarChatItem: React.FC<SidebarChatItemProps> = ({
  chat,
  current,
  onNavigate,
  onRemove,
}) => {
  return (
    <li
      className={classNames(
        { "bg-gray-800": current },
        "flex rounded-md hover:bg-gray-800",
      )}
    >
      <button
        type="button"
        onClick={() => onNavigate(chat.id)}
        className={classNames(
          {
            "text-white": current,
          },
          {
            "text-gray-400 hover:text-white": !current,
          },
          "flex flex-1 gap-x-3 px-2 py-4 lg:py-3 text-sm leading-6 font-semibold",
        )}
      >
        <span className="block">{chat.name}</span>
      </button>
      <button
        type="button"
        onClick={() => onRemove(chat.id)}
        className="px-2 py-3 group"
      >
        <TrashIcon className="w-4 h-4 stroke-gray-500 group-hover:stroke-gray-300" />
      </button>
    </li>
  );
};

export default SidebarChatItem;
