import React from "react";
import { Warning, WarningType } from "../types/Warning";
import { ErrorAlert, WarningAlert } from "./Alerts";

type WarningsProps = {
  list: Array<Warning>;
  onClose?: (item: Warning) => void;
};

const Warnings: React.FC<WarningsProps> = ({ list, onClose }) => {
  return (
    <div className="fixed top-4 left-2/4 translate-x-[-50%] w-full max-w-xl z-30">
      <div className="flex flex-col space-y-2">
        {list
          .filter((item) => item.type === WarningType.Error)
          .map((item) => (
            <ErrorAlert
              key={item.id}
              message={item.message}
              link={item.link}
              closeable={item.closeable}
              onClose={() => onClose?.(item)}
            />
          ))}

        {list
          .filter((item) => item.type === WarningType.Default)
          .map((item) => (
            <WarningAlert
              key={item.id}
              message={item.message}
              link={item.link}
              closeable={item.closeable}
              onClose={() => onClose?.(item)}
            />
          ))}
      </div>
    </div>
  );
};

export default Warnings;
