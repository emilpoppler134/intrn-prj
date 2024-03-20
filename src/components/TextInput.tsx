import React, { RefObject, useState } from 'react';

import { dynamicClassNames } from '../utils/dynamicClassNames';
import { FormHook } from '../hooks/useForm';

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
        <div className="flex items-center mt-2 text-red-400">
          <svg className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
          </svg>
          <span className="block ml-1.5 text-xs text-red-500">{ form.data[name].helperText ?? title + " cannot be empty." }</span>
        </div>
      }
    </div>
  )
}

export default TextInput;
