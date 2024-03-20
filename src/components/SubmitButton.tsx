import React, { useEffect, useState } from 'react';

import { dynamicClassNames } from '../utils/dynamicClassNames';
import { FormHook, FormValues } from '../hooks/useForm';

type Props = {
  text: string;
  form: FormHook;
  onPress: (formValues: FormValues) => Promise<void>
}

const SubmitButton: React.FC<Props> = ({ text, form, onPress }) => {
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
        !available ? "SubmitButton--incomplete" : "",
        "SubmitButton bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300"
      )}
      onClick={onButtonClick}
    >
      {!form.loading ? 
        <span className="SubmitButton-Text">{text}</span>
        :
        <div className="theme-spinner"></div>
      }
    </button>
  )
}

export default SubmitButton;
