import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import React, { RefObject, SVGProps, useState } from "react";
import { FormHook } from "../hooks/useForm";
import { dynamicClassNames } from "../utils/dynamicClassNames";

type Props = {
  name: string;
  type: "text" | "password";
  title: string;
  reference?: RefObject<HTMLInputElement>;
  autoFocus?: boolean;
  form: FormHook;
  onEnterKeyPress?: () => void;
  RightButtonIcon?: React.FC<SVGProps<SVGElement>>;
  onRightButtonPress?: () => void;
};

const TextInput: React.FC<Props> = ({ name, type, title, reference, form, autoFocus, onEnterKeyPress, RightButtonIcon, onRightButtonPress }) => {
  const [inputFocus, setInputFocus] = useState(autoFocus ?? false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(name, event.target.value);
  };

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    form.setInvalid(name, false);

    if (onEnterKeyPress !== undefined && event.key === "Enter") {
      onEnterKeyPress();
    }
  };

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const isValid = form.data[name].validation(event.target.value);
    form.setInvalid(name, !isValid);

    if (event.target.value.trim() === "") {
      setInputFocus(false);
    }
  };

  const handleRightButtonPress = () => {
    onRightButtonPress?.();
  };

  return (
    <div>
      <div className={dynamicClassNames(form.data[name].invalid ? "TextInput--Invalid" : "", "TextInput")}>
        <div className="TextInput-hover w-full h-full">
          <span className={dynamicClassNames(inputFocus ? "TextInput-key-shrink" : "", "TextInput-key")}>{title}</span>

          <input
            type={type}
            name={name}
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
            className={dynamicClassNames("TextInput-element", RightButtonIcon ? "TextInput-element-with-icon" : "")}
          />
        </div>

        {RightButtonIcon && (
          <div className="absolute top-0 right-0 bottom-0">
            <button className={dynamicClassNames(onRightButtonPress ? "cursor-pointer hover:bg-gray-100" : "cursor-default", "relative w-[44px] h-[44px] rounded-r-md")} onClick={handleRightButtonPress}>
              <div className="grid place-items-center">
                <RightButtonIcon className="block w-6 h-6 fill-gray-800" aria-hidden="true" />
              </div>
            </button>
          </div>
        )}
      </div>

      {!form.data[name].invalid ? null : (
        <div className="flex items-center mt-2">
          <ExclamationTriangleIcon className="w-4 h-4 fill-red-400" aria-hidden="true" />
          <span className="block ml-1.5 text-xs text-red-500">{form.data[name].helperText ?? title + " cannot be empty."}</span>
        </div>
      )}
    </div>
  );
};

export default TextInput;
