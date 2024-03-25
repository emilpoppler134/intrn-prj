import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

import { dynamicClassNames } from '../utils/dynamicClassNames';

type Props = {
  name: string;
  title: string;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<Props> = ({ name, title, onChange }) => {
  const [checked, setChecked] = useState(false);

  const handleRememberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    onChange(event.target.checked);
  }

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
          className={dynamicClassNames(
            checked 
              ? "bg-primary-600 dark:bg-primary-700 border-primary-300 dark:border-primary-600"
              : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
            "relative w-4 h-4 border rounded focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
          )}
        >
          {!checked ? null :
            <div className="absolute inset-0 grid place-items-center">
              <CheckIcon className="w-3 h-3 stroke-white stroke-[4px]" />
            </div>
          }
        </div>
        <div className="select-none ml-2 text-sm text-gray-500 dark:text-gray-300">{title}</div>
      </label>
    </div>
  )
}

export default Checkbox;
