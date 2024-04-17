import { InformationCircleIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import React, { RefObject, useState } from "react";

type TextAreaProps = {
  name: string;
  title: string;
  description?: string;
  rows: number;
  reference?: RefObject<HTMLTextAreaElement>;
  autoFocus?: boolean;
  onEnterKeyPress?: () => void;
};

const TextArea: React.FC<TextAreaProps> = ({
  name,
  title,
  description,
  rows,
  reference,
  autoFocus,
  onEnterKeyPress,
}) => {
  const [inputFocus, setInputFocus] = useState(autoFocus ?? false);

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (onEnterKeyPress !== undefined && event.key === "Enter") {
      onEnterKeyPress();
    }
  };

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (event.target.value.trim() === "") {
      setInputFocus(false);
    }
  };

  return (
    <div>
      <div className="TextArea">
        <span
          className={classNames(
            { "TextArea-key-shrink": inputFocus },
            "TextArea-key",
          )}
        >
          {title}
        </span>

        <textarea
          name={name}
          rows={rows}
          className="TextArea-element"
          placeholder=""
          ref={reference}
          autoFocus={autoFocus}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck="false"
          autoCorrect="off"
          onKeyUp={handleInputKeyPress}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      {!description ? null : (
        <div className="flex items-center mt-2">
          <InformationCircleIcon
            className="w-4 h-4 fill-gray-400"
            aria-hidden="true"
          />
          <span className="block ml-1.5 text-sm text-gray-600">
            {description}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextArea;
