import React from "react";
import { Chat } from "../types/Chat";
import SidebarChatItem from "./SidebarChatItem";

type SidebarChatListProps = {
  list: Array<Chat>;
  current: string | undefined;
  onNavigate: (to: string) => void;
  onRemove: (id: string) => void;
  onCreate: () => void;
  onPress: () => void;
};

const SidebarChatList: React.FC<SidebarChatListProps> = ({
  list,
  current,
  onNavigate,
  onCreate,
  onRemove,
  onPress,
}) => {
  const handleNavigate = (id: string) => {
    onPress();
    onNavigate(id);
  };

  const handleCreate = () => {
    onPress();
    onCreate();
  };

  const handleRemove = (id: string) => {
    onRemove(id);
  };

  return (
    <ul role="list" className="space-y-1">
      <li className="flex rounded-md hover:bg-gray-800">
        <button
          type="button"
          onClick={handleCreate}
          className="flex flex-1 gap-x-3 px-2 py-4 lg:py-3 text-sm leading-6 font-semibold text-gray-400 hover:text-white"
        >
          <span className="block">New chat</span>
        </button>
      </li>

      {list.map((item) => (
        <SidebarChatItem
          key={item.id}
          chat={item}
          current={item.id === current}
          onNavigate={handleNavigate}
          onRemove={handleRemove}
        />
      ))}
    </ul>
  );
};

export default SidebarChatList;
