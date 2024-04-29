import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

type RangeInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  min: number;
  max: number;
  step: number;
};

const RangeInput = <T extends FieldValues>({
  name,
  form,
  min,
  max,
  step,
}: RangeInputProps<T>): JSX.Element => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({
        field: { onChange, onBlur, ref, value = "" },
        fieldState: { error },
      }) => (
        <div>
          <div className="flex flex-col items-center">
            <input
              type="range"
              name={name}
              ref={ref}
              onChange={onChange}
              onBlur={onBlur}
              className="w-full h-full appearance-none rounded-md text-base bg-gray-200"
              min={min}
              max={max}
              step={step}
              value={value}
            />

            <span>{value}</span>
          </div>

          {error && (
            <div className="flex items-center mt-2">
              <ExclamationTriangleIcon
                className="w-4 h-4 fill-red-400"
                aria-hidden="true"
              />
              <span className="block ml-1.5 text-xs text-red-500">
                {error.message?.toString()}
              </span>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default RangeInput;
