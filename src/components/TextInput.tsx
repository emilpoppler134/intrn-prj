import React, { useState } from 'react';

interface Props {
  name: string;
  reference: string;
  type: "text" | "password";
  callback(key: string, value: string): void;
}

export const TextInput: React.FC<Props> = ({ name, reference, type, callback }) => {
  const [inputFocus, setInputFocus] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    callback(reference, event.target.value);
  }

  return (
    <div className="TextInput">
      <span className={`TextInput-key ${!inputFocus ? "" : "TextInput-key-shrink"}`}>{name}</span>
      <input
        type={type}
        onChange={handleInputChange}
        placeholder=""
        className="TextInput-element" 
        onFocus={() => setInputFocus(true)} 
        onBlur={(event) => {
          if (event.target.value.trim() === "") { setInputFocus(false) }
        }}
      />
    </div>
  )
}
