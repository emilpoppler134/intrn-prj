import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

export type NotificationProps = {
  title: string;
  message: string;
};

const Notification: React.FC<NotificationProps> = ({ title, message }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setShow(true);
    }, 100);

    const hideTimeout = setTimeout(() => {
      setShow(false);
    }, 10000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div
      className={classNames(
        { "right-6": show },
        { "-right-96": !show },
        "fixed top-6 w-full max-w-96 transition-[right] ease-out duration-200 z-30",
      )}
    >
      <div className="p-4 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className={`w-6 h-6 stroke-green-400`}
              aria-hidden="true"
            />
          </div>
          <div className="pt-0.5 flex-1 w-0 ml-3">
            <span className="block text-sm font-medium text-gray-900">
              {title}
            </span>
            <span className="block text-sm mt-1 text-gray-500">{message}</span>
          </div>
          <div className="flex-shrink-0 flex ml-4">
            <button onClick={handleClose}>
              <XMarkIcon
                className="w-5 h-5 stroke-gray-400"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
