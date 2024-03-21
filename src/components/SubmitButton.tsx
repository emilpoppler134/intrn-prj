import React, { useEffect, useState } from 'react';

import { dynamicClassNames } from '../utils/dynamicClassNames';
import { FormHook, FormValues } from '../hooks/useForm';

type SubmitButtonProps = {
  text: string;
  form: FormHook;
  onPress: (formValues: FormValues) => Promise<void>
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, form, onPress }) => {
  const [available, setAvaliable] = useState(false);

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
    <button 
      className={dynamicClassNames(
        !available ? "CustomButton--incomplete" : "",
        "CustomButton bg-primary-600 hover:bg-primary-700 shadow-sm ring-1 ring-inset ring-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300"
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
  )
}

export default SubmitButton;
