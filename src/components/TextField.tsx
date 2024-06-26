import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import { useState } from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

type TextFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  title: string;
  type?: "text" | "password";
  form: UseFormReturn<TFieldValues>;
  defaultValue?: true;
};

const TextField = <T extends FieldValues>({
  name,
  title,
  type = "text",
  form,
  defaultValue,
}: TextFieldProps<T>): JSX.Element => {
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({
        field: { onChange, onBlur, ref, value = "" },
        fieldState: { error },
      }) => (
        <div>
          <div
            className={classNames(
              {
                "shadow-text-field [&:has(input:focus-within)]:shadow-focus":
                  !error,
              },
              { "shadow-invalid": !!error },
              "relative w-full h-11 apperance-none rounded-md bg-white transition-[box-shadow] ease-in duration-75",
            )}
          >
            <div className="group w-full h-full">
              <span
                className={classNames(
                  {
                    "top-0 scale-75 origin-top-left":
                      inputFocus ||
                      value !== "" ||
                      (form.getValues(name) === undefined && defaultValue),
                  },
                  {
                    "top-2/4 scale-1 origin-center":
                      !inputFocus &&
                      value === "" &&
                      (form.getValues(name) !== undefined || !defaultValue),
                  },
                  {
                    "text-gray-500 group-has-[:focus-within]:text-field-focus":
                      !error,
                  },
                  { "text-field-invalid": !!error },
                  "pointer-events-none absolute left-3 -translate-y-2/4 px-1 text-base bg-white transition-[transform,top] duration-200 ease-in-out",
                )}
              >
                <span>{title}</span>
              </span>

              <input
                type={type}
                name={name}
                ref={ref}
                value={value}
                placeholder=""
                onChange={onChange}
                onFocus={() => setInputFocus(true)}
                onBlur={() => {
                  onBlur();
                  setInputFocus(false);
                }}
                autoCapitalize="off"
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                className="w-full h-full py-2 px-3 appearance-none rounded-md text-base"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center mt-2">
              <ExclamationTriangleIcon
                className="w-4 h-4 fill-red-400"
                aria-hidden="true"
              />
              <span className="block ml-1.5 text-xs text-red-500">
                {error.message}
              </span>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default TextField;
