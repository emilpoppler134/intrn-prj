import { useState } from 'react';

import { defaultValidation, notEmpty } from '../utils/validation';

export type FormHook = {
  data: FormData;
  loading: boolean;
  clearData: () => void;
  setValue: (key: string, value: string) => void;
  setInvalid: (key: string, invalid: boolean) => void;
  validateForm: () => true | Array<string>;
  handleSubmit: (callback: (formValues: FormValues) => Promise<void>) => Promise<void>;
};

type FormData = {
  [key: string]: {
    stage: number;
    value: string;
    invalid: boolean;
    helperText: string | null;
    validation: (value: string) => boolean;
  };
};

export type FormValues = {
  [key: string]: string;
};

type FormPropList = Array<Array<FormPropItem>>;

type FormPropItem = {
  key: string;
  value?: string;
  helperText?: string;
  validation?: ((value: string) => boolean) | null;
}

export const useForm = (fields: FormPropList = [[]], step: number = 0): FormHook => {
  const initialFormState: FormData = {};

  fields.forEach((stage, index) => {
    stage.forEach(item => {
      initialFormState[item.key] = {
        stage: index,
        value: item.value ?? '',
        invalid: false,
        helperText: item.helperText ?? null,
        validation: item.validation ?? item.validation === null ? (_) => true : defaultValidation
      };
    })
  });

  const [data, setData] = useState<FormData>(initialFormState);
  const [loading, setLoading] = useState(false);

  const clearData = () => {
    Object.keys(data).forEach(key => {
      setData(prevState => ({
        ...prevState,
        [key]: {
          ...prevState[key],
          value: "",
          invalid: false
        }
      }));
    });
  };

  const setValue = (key: string, value: string) => {
    setData(prevState => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        value
      }
    }));
  };

  const setInvalid = (key: string, invalid: boolean) => {
    setData(prevState => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        invalid
      }
    }));
  };

  const validateForm = (): true | Array<string> => {
    const inputValidation = Object.keys(data).filter(key => data[key].stage === step).map(key => {
      return data[key].validation(data[key].value) ? null : key;
    });
    const invalidInputs: Array<string> = inputValidation.filter(notEmpty);

    return invalidInputs.length === 0 ? true : invalidInputs;
  }

  const handleSubmit = async (callback: (values: FormValues) => Promise<void>) => {
    if (loading) return;

    const validation = validateForm();
    
    if (validation !== true) {
      validation.forEach(key => setInvalid(key, true));
      return;
    }

    setLoading(true);

    const response = Object.keys(data).reduce<FormValues>(function(acc, key) {
      acc[key] = data[key].value;
      return acc;
    }, {});

    await callback(response);

    setLoading(false);
  };

  return {
    data,
    loading,
    clearData,
    setValue,
    setInvalid,
    validateForm,
    handleSubmit
  };
};
