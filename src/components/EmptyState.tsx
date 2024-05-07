import { PlusIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Icon } from "../types/Icon";
import { PrimaryButton } from "./Buttons";

type EmptyStateProps = {
  Icon: Icon;
  title: string;
  description: string;
  buttonTitle: string;
  onPress: () => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  Icon,
  title,
  description,
  buttonTitle,
  onPress,
}) => {
  return (
    <div className="px-4 py-12 bg-white rounded-lg ring-1 ring-slate-900/10">
      <div className="flex flex-col items-center">
        <Icon className="w-12 h-12 text-gray-700" />
        <span className="block text-gray-900 text-sm font-semibold mt-2">
          {title}
        </span>
        <span className="block text-gray-500 text-sm mt-1">{description}</span>
        <div className="mt-6">
          <PrimaryButton
            title={buttonTitle}
            Icon={PlusIcon as Icon}
            onPress={onPress}
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
