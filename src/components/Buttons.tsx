import classNames from "classnames";
import { Icon } from "../types/Icon";

export type ButtonProps = {
  title: string;
  Icon?: Icon;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
};

type ButtonStylingProps = {
  backgroundColor: "bg-primary-600" | "bg-red-600" | "bg-white";
  color: "text-white" | "text-gray-700";
  fill: "fill-white" | "fill-gray-700";
  ring: "ring-primary-600" | "ring-red-600" | "ring-gray-300";
  hover: "bg-primary-700" | "bg-red-700" | "bg-gray-100";
  focus: "ring-primary-300" | "ring-red-300";
  padding: "py-1" | "py-2";
  fullWidth: boolean;
};

const createButtonComponent =
  ({
    backgroundColor,
    color,
    fill,
    ring,
    hover,
    focus,
    padding,
    fullWidth,
  }: ButtonStylingProps): React.FC<ButtonProps> =>
  ({
    disabled = false,
    loading = false,
    onPress,
    title,
    type = "button",
    Icon,
  }) => (
    <div
      className={classNames(
        "w-full",
        { "sm:w-full": fullWidth },
        { "sm:w-auto": !fullWidth },
      )}
    >
      <button
        type={type}
        onClick={onPress}
        className={classNames(
          `relative w-full px-4 ${padding} rounded-md shadow-md ${backgroundColor} hover:${hover} ring-1 ${ring} focus:ring-4 focus:${focus}`,
          { "pointer-events-none": disabled },
        )}
      >
        <div
          className={classNames(
            { "opacity-0": loading },
            "flex items-center justify-center py-0.5 pointer-events-none",
          )}
        >
          {Icon === undefined ? null : (
            <div className="grid place-items-center">
              <Icon className={`w-5 h-5 mr-1 ${fill}`} aria-hidden="true" />
            </div>
          )}
          <span
            className={classNames(
              { "text-opacity-60": disabled },
              `text-sm font-semibold ${color} pointer-events-none`,
            )}
          >
            {title}
          </span>
        </div>

        {!loading ? null : <div className="theme-spinner"></div>}
      </button>
    </div>
  );

export const PrimaryButton = createButtonComponent({
  backgroundColor: "bg-primary-600",
  color: "text-white",
  fill: "fill-white",
  ring: "ring-primary-600",
  hover: "bg-primary-700",
  focus: "ring-primary-300",
  padding: "py-2",
  fullWidth: true,
});

export const SubmitButton = createButtonComponent({
  backgroundColor: "bg-primary-600",
  color: "text-white",
  fill: "fill-white",
  ring: "ring-primary-600",
  hover: "bg-primary-700",
  focus: "ring-primary-300",
  padding: "py-2",
  fullWidth: false,
});

export const RevokeButton = createButtonComponent({
  backgroundColor: "bg-red-600",
  color: "text-white",
  fill: "fill-white",
  ring: "ring-red-600",
  hover: "bg-red-700",
  focus: "ring-red-300",
  padding: "py-2",
  fullWidth: false,
});

export const CancelButton = createButtonComponent({
  backgroundColor: "bg-white",
  color: "text-gray-700",
  fill: "fill-gray-700",
  ring: "ring-gray-300",
  hover: "bg-gray-100",
  focus: "ring-primary-300",
  padding: "py-2",
  fullWidth: false,
});
