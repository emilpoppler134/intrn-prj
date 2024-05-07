import { Menu, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Fragment } from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Icon } from "../types/Icon";
import { Prompt } from "../types/Prompt";
import { CancelButton } from "./Buttons";

type PromptItem = {
  option: string;
  value: string;
};

type ControlProps = {
  field: {
    onChange: (...event: any[]) => void;
    value: Array<PromptItem>;
  };
};

type PromptListInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  title: string;
  description: string;
  options: Array<Prompt>;
};

const PromptListInput = <T extends FieldValues>({
  name,
  form,
  title,
  description,
  options,
}: PromptListInputProps<T>): JSX.Element => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value } }: ControlProps) => {
        if (value === undefined) return <></>;

        return (
          <div className="flex flex-col items-start">
            <div className="pb-4">
              <span className="text-sm font-medium leading-6 text-gray-900">
                {title}
              </span>
            </div>

            <ul className="flex flex-col gap-3 w-full pb-6">
              {value.map((item, index) => (
                <li className="flex gap-4" key={index}>
                  <div className="w-full max-w-80">
                    {index < 1 && (
                      <div className="pb-2">
                        <span className="block leading-6 text-sm text-gray-600">
                          Subject
                        </span>
                      </div>
                    )}

                    <Menu
                      as="div"
                      className="group relative inline-flex w-full h-10"
                    >
                      <div className="w-full h-full">
                        <Menu.Button className="inline-flex items-center justify-between w-full h-full px-3 py-2 rounded-md shadow-text-field bg-white hover:bg-gray-50 group-focus-within:shadow-focus transition-[box-shadow]">
                          <span className="text-base font-medium text-gray-700">
                            {options.find(
                              (option) => option._id === item.option,
                            )?.subject || ""}
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
                            {options.map((option) => (
                              <Menu.Item key={option._id}>
                                <button
                                  type="button"
                                  className={classNames(
                                    {
                                      "pointer-events-none opacity-50": value
                                        .filter((p) => p.option !== item.option)
                                        .map((p) => p.option)
                                        .includes(option._id),
                                    },
                                    "block w-full px-4 py-2 hover:bg-gray-100",
                                  )}
                                  onClick={() =>
                                    onChange(
                                      value.map((i) =>
                                        i !== item
                                          ? i
                                          : { option: option._id, value: "" },
                                      ),
                                    )
                                  }
                                >
                                  <div className="flex justify-between">
                                    <div className="flex flex-col text-left">
                                      <span className="text-sm text-gray-700">
                                        {option.subject}
                                      </span>
                                    </div>

                                    {item.option === option._id && (
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
                  </div>

                  <div className="w-full">
                    {index < 1 && (
                      <div className="pb-2">
                        <span className="block leading-6 text-sm text-gray-600">
                          Value
                        </span>
                      </div>
                    )}

                    <div className="relative w-full h-10 apperance-none rounded-md bg-white transition-[box-shadow] ease-in duration-75 shadow-text-field [&:has(input:focus-within)]:shadow-focus">
                      <input
                        type="text"
                        name={name}
                        value={item.value}
                        placeholder={
                          options.find((option) => option._id === item.option)
                            ?.placeholder || ""
                        }
                        onChange={(e) =>
                          onChange(
                            value.map((i) =>
                              i !== item ? i : { ...i, value: e.target.value },
                            ),
                          )
                        }
                        autoCapitalize="off"
                        autoComplete="off"
                        spellCheck="false"
                        autoCorrect="off"
                        className={classNames(
                          "w-full h-full py-2 px-3 appearance-none rounded-md text-base",
                        )}
                      />
                    </div>
                  </div>

                  <div
                    className={classNames({
                      "mt-8 opacity-50 pointer-events-none": index < 1,
                    })}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (value.length <= 1) return;
                        onChange(value.filter((i) => i !== item));
                      }}
                      className="w-10 h-full hover:scale-125 transition-[transform] duration-300"
                    >
                      <div className="h-full flex items-center px-2.5">
                        <TrashIcon className="w-full h-auto stroke-gray-500" />
                      </div>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {options.filter(
              (option) =>
                !value.map((prevItem) => prevItem.option).includes(option._id),
            ).length > 0 && (
              <CancelButton
                title="Add item"
                Icon={PlusIcon as Icon}
                onPress={() => {
                  if (
                    options.filter(
                      (option) =>
                        !value
                          .map((prevItem) => prevItem.option)
                          .includes(option._id),
                    ).length === 0
                  ) {
                    return;
                  }

                  onChange([
                    ...value,
                    {
                      option: options.filter(
                        (option) =>
                          !value
                            .map((prevItem) => prevItem.option)
                            .includes(option._id),
                      )[0]._id,
                      value: "",
                    },
                  ]);
                }}
              />
            )}
          </div>
        );
      }}
    />
  );
};

export default PromptListInput;
