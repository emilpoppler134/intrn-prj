import React, { useEffect, useState } from "react";
import { FormHook, FormValues } from "../hooks/useForm";
import { dynamicClassNames } from "../utils/dynamicClassNames";

const palette = {
  primary: {
    bg: "bg-primary-600",
    hover: "bg-primary-700",
    focus: "ring-primary-300",
  },
  red: { bg: "bg-red-600", hover: "bg-red-700", focus: "ring-red-300" },
};

type SubmitButtonProps = {
  text: string;
  form: FormHook;
  onPress: (formValues: FormValues) => Promise<void>;
  fullWidth?: boolean;
  color?: keyof typeof palette;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, form, onPress, fullWidth = true, color = "primary" }) => {
  const [available, setAvaliable] = useState(false);

  const { bg, hover, focus } = palette[color];

  useEffect(() => {
    const isValid = form.validateForm();
    setAvaliable(isValid === true ?? false);
  }, [form]);

  const onButtonClick = () => {
    form.handleSubmit(onPress);
    return;
  };

  return (
    <div className={dynamicClassNames(fullWidth ? "" : "sm:w-auto", "w-full")}>
      <button className={dynamicClassNames(!available ? "pointer-events-none" : "", `relative w-full px-4 py-2 rounded-md shadow-md ${bg} hover:${hover} focus:ring-4 focus:${focus}`)} onClick={onButtonClick}>
        <span className={form.loading ? "opacity-0" : ""}>
          <span className={dynamicClassNames(!available ? "text-opacity-60" : "", "text-sm font-semibold text-white pointer-events-none")}>{text}</span>
        </span>

        {!form.loading ? null : <div className="theme-spinner"></div>}
      </button>
    </div>
  );
};

export default SubmitButton;
