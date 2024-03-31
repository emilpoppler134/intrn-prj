import React, { useEffect, useState } from 'react';

import { dynamicClassNames } from '../utils/dynamicClassNames';
import { FormHook, FormValues } from '../hooks/useForm';

type SubmitButtonProps = {
  text: string;
  form: FormHook;
  onPress: (formValues: FormValues) => Promise<void>
  fullWidth?: boolean;
  palette?: Array<string>;
}

const defaultPalette = ["bg-primary-600", "bg-primary-700", "ring-primary-300"];

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, form, onPress, fullWidth = true, palette = defaultPalette }) => {
  const [available, setAvaliable] = useState(false);

  const [background, hover, focus] = palette;

  useEffect(() => {
    const isValid = form.validateForm();
    setAvaliable(isValid === true ?? false);
  }, [form]);

  const onButtonClick = () => {
    form.handleSubmit(onPress);
    return;
  }

  return (
    <div className={dynamicClassNames(
      fullWidth ? "" : "sm:w-auto",
      "w-full"
    )}>
      <button 
        className={dynamicClassNames(
          !available ? "pointer-events-none" : "",
          `relative w-full px-4 py-2 rounded-md shadow-md ${background} hover:${hover} focus:ring-4 focus:${focus}`
        )}
        onClick={onButtonClick}
      >
        <span className={form.loading ? "opacity-0" : ""}>
          <span 
            className={dynamicClassNames(
              !available ? "text-opacity-60" : "",
              "text-sm font-semibold text-white pointer-events-none"
            )}
          >{text}</span>
        </span>

        {!form.loading ? null :
          <div className="theme-spinner"></div>
        }
      </button>
    </div>
  )
}

export default SubmitButton;
