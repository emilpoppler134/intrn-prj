import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import React, { SVGProps } from "react";
import { Link } from "react-router-dom";
import { WarningLink } from "../types/Warning";

type AlertProps = {
  message: string;
  link?: WarningLink;
  closeable: boolean;
  onClose?: () => void;
};

type AlertStylingProps = {
  backgroundColor: "bg-red-50" | "bg-yellow-50";
  color: "text-red-700" | "text-yellow-700";
  border: "border-red-400" | "border-yellow-400";
  fill: "fill-red-400" | "fill-yellow-400";
  stroke: "stroke-red-500" | "stroke-yellow-500";
  Icon: React.FC<SVGProps<SVGElement>>;
};

const createAlertComponent =
  ({
    backgroundColor,
    color,
    border,
    fill,
    stroke,
    Icon,
  }: AlertStylingProps): React.FC<AlertProps> =>
  ({ message, link, closeable, onClose }) => (
    <div className="relative">
      <div className={`p-4 shadow-lg ${backgroundColor} border-l-4 ${border}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${fill}`} aria-hidden="true" />
          </div>
          <div className="ml-3">
            <span className={`block text-sm ${color}`}>
              <span>{message}</span>

              {!link ? null : (
                <Link
                  reloadDocument={link.reload}
                  to={link.to}
                  className="ml-1.5"
                >
                  <span className="underline font-medium">{link.title}</span>
                </Link>
              )}
            </span>
          </div>

          {!closeable ? null : (
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-2"
              onClick={onClose}
            >
              <XMarkIcon className={`h-6 w-6 ${stroke}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

export const ErrorAlert = createAlertComponent({
  backgroundColor: "bg-red-50",
  color: "text-red-700",
  border: "border-red-400",
  fill: "fill-red-400",
  stroke: "stroke-red-500",
  Icon: XCircleIcon as React.FC<SVGProps<SVGElement>>,
});

export const WarningAlert = createAlertComponent({
  backgroundColor: "bg-yellow-50",
  color: "text-yellow-700",
  border: "border-yellow-400",
  fill: "fill-yellow-400",
  stroke: "stroke-yellow-500",
  Icon: ExclamationTriangleIcon as React.FC<SVGProps<SVGElement>>,
});
