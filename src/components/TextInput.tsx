import React, { RefObject, useState } from 'react';

import { dynamicClassNames } from '../utils/dynamicClassNames';
import { FormHook } from '../hooks/useForm';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

type Props = {
  name: string;
  type: "text" | "password";
  title: string;
  reference?: RefObject<HTMLInputElement>;
  autoFocus?: boolean;
  form: FormHook;
  onEnterKeyPress?: () => void;
}

const TextInput: React.FC<Props> = ({ name, type, title, reference, form, autoFocus, onEnterKeyPress }) => {
  const [inputFocus, setInputFocus] = useState(autoFocus ?? false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(name, event.target.value);
  }

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    form.setInvalid(name, false);

    if (onEnterKeyPress !== undefined && event.key === "Enter") {
      onEnterKeyPress();
    }
  }

  const handleInputFocus = () => {
    setInputFocus(true);
  }

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
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
          form.data[name].invalid ? "TextInput--Invalid" : "",
          "TextInput"
        )}
      >
        <span 
          className={dynamicClassNames(
            inputFocus ? "TextInput-key-shrink" : "",
            "TextInput-key"
          )}
        >{title}</span>

        <input
          type={type}
          name={name}
          className="TextInput-element" 
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

      {!form.data[name].invalid ? null : 
        <div className="flex items-center mt-2">
          <ExclamationTriangleIcon className="w-4 h-4 fill-red-400" aria-hidden="true" />
          <span className="block ml-1.5 text-xs text-red-500">{ form.data[name].helperText ?? title + " cannot be empty." }</span>
        </div>
      }
    </div>
  )
}

export default TextInput;
