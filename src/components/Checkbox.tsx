import React, { useState } from 'react';

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
    <div className="flex items-start">
      <input 
        id={name}
        aria-describedby={name}
        type="checkbox"
        className="hidden"
        onChange={handleRememberChange}
      />
      <label htmlFor={name} className="flex items-center cursor-pointer">
        <div className={`${checked ? "bg-primary-600 dark:bg-primary-700 border-primary-300 dark:border-primary-600" : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"} relative w-4 h-4 border rounded focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800`}>
          {!checked ? null :
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-3 h-3 text-white stroke-current fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path strokeWidth="20" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
              </svg>
            </div>
          }
        </div>
        <div className="select-none ml-2 text-sm text-gray-500 dark:text-gray-300">{title}</div>
      </label>
    </div>
  )
}

export default Checkbox;
