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
      render={({ field: { onChange, value } }) => (
        <div className="flex flex-col [&>div]:w-full [&>div]:relative">
          <div className="h-2 [&>div]:w-full [&>div]:h-full">
            <div className="absolute">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="absolute w-full h-full opacity-0"
              />
            </div>

            <div className="flex pointer-events-none">
              <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-primary-500"
                  style={{
                    width: `calc(${((value - min) / (max - min)) * 100}% - ${((value - min) / (max - min)) * 14.5}px + 2px)`,
                  }}
                ></div>
              </div>
              <div
                className="absolute w-[14.5px] h-[14.5px] bg-primary-500 rounded-full top-2/4 -translate-y-2/4"
                style={{
                  left: `calc(${((value - min) / (max - min)) * 100}% - ${((value - min) / (max - min)) * 14.5}px)`,
                }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-700">{min}</span>

            <span
              className="absolute flex text-sm text-gray-900 px-2 py-1 bg-white ring-1 ring-gray-200 rounded-md"
              style={{
                transform: "translateX(calc(-50% + (14.5px / 2)))",
                left: `calc(${((value - min) / (max - min)) * 100}% - ${((value - min) / (max - min)) * 14.5}px)`,
              }}
            >
              {value}
            </span>
            <span className="text-sm text-gray-700">{max}</span>
          </div>
        </div>
      )}
    />
  );
};

export default RangeInput;
