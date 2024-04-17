import classNames from "classnames";
import React, { SVGProps } from "react";

type SidebarItemProps = {
  id: string;
  title: string;
  Icon: React.FC<SVGProps<SVGElement>>;
  current: string;
  onPress: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  title,
  Icon,
  current,
  onPress,
}) => {
  return (
    <button
      className={classNames(
        id === current ? "bg-primary-100 hover:bg-primary-100" : "",
        "flex items-center w-full p-3 leading-tight rounded-lg text-start hover:bg-gray-100",
      )}
      onClick={onPress}
    >
      <div className="grid mr-4 place-items-center">
        <Icon className="block w-6 h-6" aria-hidden="true" />
      </div>
      <span>{title}</span>
    </button>
  );
};

export default SidebarItem;
