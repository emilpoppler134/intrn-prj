import { PlusIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Bot } from "../types/Bot";
import { Icon } from "../types/Icon";
import BotItem from "./BotItem";
import EmptyState from "./EmptyState";

type BotListProps = {
  bots: Array<Bot>;
  hasSubscription: boolean;
  onOpen: () => void;
};

const BotList: React.FC<BotListProps> = ({ bots, hasSubscription, onOpen }) => {
  return (
    <>
      {bots.length > 0 ? (
        <div className="space-y-8">
          <span className="px-p text-xl">Chatbots</span>

          <ul
            role="list"
            className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {bots.map((item) => (
              <BotItem key={item.id} bot={item} disabled={hasSubscription} />
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState
          Icon={PlusIcon as Icon}
          title="No bots"
          description="Get started by creating a new bot."
          buttonTitle="New bot"
          onPress={onOpen}
        />
      )}
    </>
  );
};

export default BotList;
