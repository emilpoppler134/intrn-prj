import React from "react";
import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

type WarningAlertProps = {
  message: string;
  link?: LinkProps;
};

type LinkProps = {
  title: string;
  to: string;
};

const WarningAlert: React.FC<WarningAlertProps> = ({ message, link }) => {
  return (
    <div className="fixed top-4 left-2/4 translate-x-[-50%] w-full max-w-xl z-30">
      <div className="p-4 shadow-lg bg-yellow-50 border-l-4 border-yellow-400">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="w-5 h-5 fill-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <span className="block text-sm text-yellow-700">
              <span>{message}</span>

              {!link ? null : (
                <Link to={link.to} className="ml-1.5">
                  <span className="underline font-medium">{link.title}</span>
                </Link>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningAlert;
