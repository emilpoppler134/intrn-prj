import { CheckCircleIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Configuration } from "../types/Configuration";

type RadioCardInputProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  options: Array<Configuration>;
};

const RadioCardInput = <T extends FieldValues>({
  form,
  name,
  options,
}: RadioCardInputProps<T>): JSX.Element => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value } }) => (
        <div className="grid grid-cols-1 gap-y-6 mt-4 sm:grid-cols-3 sm:gap-x-4">
          {options.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                onChange(item._id);
                form.trigger(name);
              }}
              className="relative flex cursor-pointer rounded-lg bg-white border border-gray-300 p-4 shadow-sm"
            >
              <div className="flex flex-1">
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {item.title}
                  </span>
                  <span className="text-sm flex flex-1 items-start mt-1 text-gray-500">
                    {item.description}
                  </span>
                </span>
              </div>

              <CheckCircleIcon
                className={classNames(
                  { visible: value === item._id },
                  { invisible: value !== item._id },
                  "w-5 h-5 fill-primary-500",
                )}
                aria-hidden="true"
              />

              <span
                className={classNames(
                  { "border-primary-500": value === item._id },
                  { "border-transparent": value !== item._id },
                  "absolute -inset-px pointer-events-none rounded-lg border-2",
                )}
              ></span>
            </div>
          ))}
        </div>
      )}
    />
  );
};

export default RadioCardInput;
