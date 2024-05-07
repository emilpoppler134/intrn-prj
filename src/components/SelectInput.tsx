import { Menu, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import Flag from "react-world-flags";

type SelectOption = {
  id: string;
  title: string;
  description?: string;
  countryCode?: string;
};

type SelectInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  options: Array<SelectOption>;
};

const SelectInput = <T extends FieldValues>({
  name,
  form,
  options,
}: SelectInputProps<T>): JSX.Element => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value } }) => (
        <Menu as="div" className="group relative inline-flex w-full">
          <div className="w-full max-w-96">
            <Menu.Button className="inline-flex items-center justify-between w-full px-3 py-2 rounded-md shadow-text-field bg-white hover:bg-gray-50 group-focus-within:shadow-focus transition-[box-shadow]">
              <span className="flex items-center">
                {(() => {
                  const selected = options.find((item) => item.id === value);

                  return (
                    <>
                      {selected && selected.countryCode && (
                        <Flag
                          code={selected.countryCode}
                          className="h-2.5 mr-3"
                        />
                      )}

                      <span className="text-base font-medium text-gray-700">
                        {selected ? selected.title : ""}
                      </span>
                    </>
                  );
                })()}
              </span>

              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {options.map((item) => (
                  <Menu.Item key={item.id}>
                    <button
                      type="button"
                      className={`block w-full px-4 py-2 hover:bg-gray-100`}
                      onClick={() => onChange(item.id)}
                    >
                      <div className="flex justify-between">
                        <div className="flex flex-col text-left">
                          <span className="flex items-center">
                            {item.countryCode && (
                              <Flag
                                code={item.countryCode}
                                className="h-2.5 mr-3"
                              />
                            )}

                            <span className="text-sm text-gray-700">
                              {item.title}
                            </span>
                          </span>

                          {item.description && (
                            <span className="text-xs font-light text-gray-500 pt-1">
                              {item.description}
                            </span>
                          )}
                        </div>

                        {value === item.id && (
                          <div className="flex items-center">
                            <CheckIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                    </button>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    />
  );
};

export default SelectInput;
