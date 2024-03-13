import React, { useState } from 'react';

type Props = {
  name: string;
  reference: string;
  type: "text" | "password";
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<Props> = ({ name, reference, type, onChange }) => {
  const [inputFocus, setInputFocus] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  }

  return (
    <div className="TextInput">
      <span className={`TextInput-key ${!inputFocus ? "" : "TextInput-key-shrink"}`}>{name}</span>
      <input
        type={type}
        name={reference}
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

export default TextInput;
