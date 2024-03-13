import React, { useState } from 'react';

type Props = {
  name: string;
  type: "text" | "password";
  title: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<Props> = ({ name, type, title, onChange }) => {
  const [inputFocus, setInputFocus] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  }

  return (
    <div className="TextInput">
      <span className={`TextInput-key ${!inputFocus ? "" : "TextInput-key-shrink"}`}>{title}</span>
      <input
        type={type}
        name={name}
        className="TextInput-element" 
        placeholder=""
        onChange={handleInputChange}
        onFocus={() => setInputFocus(true)} 
        onBlur={(event) => {
          if (event.target.value.trim() === "") { setInputFocus(false) }
        }}
      />
    </div>
  )
}

export default TextInput;
