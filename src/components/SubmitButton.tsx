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

const defaultPalette = ["bg-primary-600", "bg-primary-700", "ring-primary-600", "ring-primary-300"];

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, form, onPress, fullWidth = true, palette = defaultPalette }) => {
  const [available, setAvaliable] = useState(false);

  const [background, hover, ring, focus] = palette;

  useEffect(() => {
    const isValid = form.validateForm();
    setAvaliable(isValid === true ?? false);
  }, [form]);

  const onButtonClick = () => {
    if (available) {
      form.handleSubmit(onPress);
    }
  }

  return (
    <div className={dynamicClassNames(
      fullWidth ? "" : "sm:w-auto",
      "w-full"
    )}>
      <button 
        className={dynamicClassNames(
          !available ? "CustomButton--incomplete" : "",
          `CustomButton ${background} hover:${hover} shadow-sm ring-1 ring-inset ${ring} focus:ring-4 focus:outline-none focus:${focus}`
        )}
        onClick={onButtonClick}
      >
        <span
          className={dynamicClassNames(
            form.loading ? "opacity-0" : "",
            "CustomButton-Text text-white"
          )}
        >
          <span>{text}</span>
        </span>

        {!form.loading ? null :
          <div className="theme-spinner"></div>
        }
      </button>
    </div>
  )
}

export default SubmitButton;
