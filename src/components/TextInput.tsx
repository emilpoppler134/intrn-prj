import React, { RefObject, useState } from 'react';
import { dynamicClassNames } from '../utils/dynamicClassNames';

type Props = {
  name: string;
  type: "text" | "password";
  title: string;
  reference?: RefObject<HTMLInputElement>;
  autoFocus?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyPress?: () => void;
}

const TextInput: React.FC<Props> = ({ name, type, title, reference, autoFocus, onChange, onEnterKeyPress }) => {
  const [inputFocus, setInputFocus] = useState(autoFocus ?? false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  }

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onEnterKeyPress === undefined || event.key !== "Enter") return;
    onEnterKeyPress();
  }

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setInputFocus(true);
  }

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.trim() !== "") return; 
    setInputFocus(false);
  }

  return (
    <div className="TextInput">
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
  )
}

export default TextInput;
