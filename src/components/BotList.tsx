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
        <div>
          <span className="px-p text-xl">Avaliable chatbots</span>

          <div className="grid grid-cols-4 gap-12 mt-8">
            {bots.map((item) => (
              <BotItem key={item.id} bot={item} disabled={hasSubscription} />
            ))}

            <div className="flex flex-col">
              <button className="group" onClick={onOpen}>
                <div className="flex flex-col">
                  <div className="mb-1">
                    <span className="text-base text-gray-700 text-opacity-0">
                      ‎
                    </span>
                  </div>
                  <div className="relative pb-[100%] outline outline-2 outline-gray-300">
                    <div className="absolute-center p-4">
                      <PlusIcon
                        className="w-12 h-12 fill-gray-700"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div className="text-left mt-2">
                    <span className="text-base font-medium text-gray-600 group-hover:underline">
                      New
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
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
