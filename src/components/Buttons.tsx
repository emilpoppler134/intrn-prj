import classNames from "classnames";

type ButtonProps = {
  title: string;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
};

type ButtonStylingProps = {
  backgroundColor: "bg-primary-600" | "bg-red-600" | "bg-white";
  color: "text-white" | "text-gray-700";
  ring: "ring-primary-600" | "ring-red-600" | "ring-gray-300";
  hover: "bg-primary-700" | "bg-red-700" | "bg-gray-100";
  focus: "ring-primary-300" | "ring-red-300";
  fullWidth: boolean;
};

const createButtonComponent =
  ({
    backgroundColor,
    color,
    ring,
    hover,
    focus,
    fullWidth,
  }: ButtonStylingProps): React.FC<ButtonProps> =>
  ({ disabled = false, loading = false, onPress, title, type = "button" }) => (
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
          `relative w-full px-4 py-2 rounded-md shadow-md ${backgroundColor} hover:${hover} ring-1 ${ring} focus:ring-4 focus:${focus}`,
          { "pointer-events-none": disabled },
        )}
      >
        <span className={loading ? "opacity-0" : ""}>
          <span
            className={classNames(
              { "text-opacity-60": disabled },
              `text-sm font-semibold ${color} pointer-events-none`,
            )}
          >
            {title}
          </span>
        </span>

        {!loading ? null : <div className="theme-spinner"></div>}
      </button>
    </div>
  );

export const PrimaryButton = createButtonComponent({
  backgroundColor: "bg-primary-600",
  color: "text-white",
  ring: "ring-primary-600",
  hover: "bg-primary-700",
  focus: "ring-primary-300",
  fullWidth: true,
});

export const SubmitButton = createButtonComponent({
  backgroundColor: "bg-primary-600",
  color: "text-white",
  ring: "ring-primary-600",
  hover: "bg-primary-700",
  focus: "ring-primary-300",
  fullWidth: false,
});

export const RevokeButton = createButtonComponent({
  backgroundColor: "bg-red-600",
  color: "text-white",
  ring: "ring-red-600",
  hover: "bg-red-700",
  focus: "ring-red-300",
  fullWidth: false,
});

export const CancelButton = createButtonComponent({
  backgroundColor: "bg-white",
  color: "text-gray-700",
  ring: "ring-gray-300",
  hover: "bg-gray-100",
  focus: "ring-primary-300",
  fullWidth: false,
});
