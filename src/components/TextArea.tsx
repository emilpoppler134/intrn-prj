import React, { RefObject, useState } from 'react';

import { dynamicClassNames } from '../utils/dynamicClassNames';
import { FormHook } from '../hooks/useForm';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

type TextAreaProps = {
  name: string;
  title: string;
  description?: string;
  rows: number;
  reference?: RefObject<HTMLTextAreaElement>;
  autoFocus?: boolean;
  form: FormHook;
  onEnterKeyPress?: () => void;
}

const TextArea: React.FC<TextAreaProps> = ({ name, title, description, rows, reference, form, autoFocus, onEnterKeyPress }) => {
  const [inputFocus, setInputFocus] = useState(autoFocus ?? false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue(name, event.target.value);
  }

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    form.setInvalid(name, false);

    if (onEnterKeyPress !== undefined && event.key === "Enter") {
      onEnterKeyPress();
    }
  }

  const handleInputFocus = () => {
    setInputFocus(true);
  }

  const handleInputBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const isValid = form.data[name].validation(event.target.value);
    form.setInvalid(name, !isValid);

    if (event.target.value.trim() === "") {
      setInputFocus(false);
    } 
  }

  return (
    <div>
      <div
        className={dynamicClassNames(
          form.data[name].invalid ? "TextArea--Invalid" : "",
          "TextArea"
        )}
      >
        <span 
          className={dynamicClassNames(
            inputFocus ? "TextArea-key-shrink" : "",
            "TextArea-key"
          )}
        >{title}</span>

        <textarea
          name={name}
          rows={3}
          className="TextArea-element" 
          value={form.data[name].value}
          placeholder=""
          ref={reference}
          autoFocus={autoFocus}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck="false"
          autoCorrect="off"
          onChange={handleInputChange}
          onKeyUp={handleInputKeyPress}
          onFocus={handleInputFocus} 
          onBlur={handleInputBlur}
        />
      </div>

      {!form.data[name].invalid ? 
        !description ? null : 
          <div className="flex items-center mt-2">
            <InformationCircleIcon className="w-4 h-4 fill-gray-400" aria-hidden="true" />
            <span className="block ml-1.5 text-sm text-gray-600">{ description }</span>
          </div>
      : 
        <div className="flex items-center mt-2">
          <ExclamationTriangleIcon className="w-4 h-4 fill-red-400" aria-hidden="true" />
          <span className="block ml-1.5 text-xs text-red-500">{ form.data[name].helperText ?? title + " cannot be empty." }</span>
        </div>
      }
    </div>
  )
}

export default TextArea;
