import { CheckIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { useState } from "react";

type CheckboxProps = {
  name: string;
  title: string;
  onChange: (checked: boolean) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({ name, title, onChange }) => {
  const [checked, setChecked] = useState(false);

  const handleRememberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    onChange(event.target.checked);
  };

  return (
    <div className="checkbox flex items-start">
      <input
        id={name}
        aria-describedby={name}
        type="checkbox"
        className="hidden"
        onChange={handleRememberChange}
      />
      <label htmlFor={name} className="flex items-center cursor-pointer">
        <div
          className={classNames(
            { "bg-primary-600 border-primary-300": checked },
            { "bg-gray-50 border-gray-300": !checked },
            "relative w-4 h-4 border rounded focus:ring-3 focus:ring-primary-300",
          )}
        >
          {!checked ? null : (
            <div className="absolute inset-0 grid place-items-center">
              <CheckIcon className="w-3 h-3 stroke-white stroke-[4px]" />
            </div>
          )}
        </div>
        <div className="select-none ml-2 text-sm text-gray-500">{title}</div>
      </label>
    </div>
  );
};

export default Checkbox;
