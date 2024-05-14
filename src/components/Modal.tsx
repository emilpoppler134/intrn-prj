import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import React, { FormEvent, Fragment, ReactNode, useRef } from "react";
import {
  ButtonProps,
  CancelButton,
  RevokeButton,
  SubmitButton,
} from "./Buttons";
import Form from "./Form";

type ModalProps = {
  children: ReactNode;
  show: boolean;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

type CustomModalProps = {
  ModalIcon: JSX.Element;
  CustomButton: React.FC<ButtonProps>;
};

const createModalComponent =
  ({ ModalIcon, CustomButton }: CustomModalProps): React.FC<ModalProps> =>
  ({
    children,
    show,
    title,
    loading = false,
    disabled = false,
    onSubmit,
    onCancel,
  }) => {
    const cancelButtonRef = useRef(null);

    return (
      <Transition.Root show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          initialFocus={cancelButtonRef}
          onClose={onCancel}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="w-full max-w-md relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <Form onSubmit={onSubmit}>
                    <div>
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          {ModalIcon}

                          <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <Dialog.Title
                              as="h3"
                              className="text-base font-semibold leading-6 text-gray-900"
                            >
                              {title}
                            </Dialog.Title>
                            <div className="mt-2">{children}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 px-4 py-3 bg-gray-50 sm:flex-row-reverse sm:px-6">
                        <CustomButton
                          title="Create"
                          type="submit"
                          loading={loading}
                          disabled={disabled}
                        />

                        <CancelButton title="Cancel" onPress={onCancel} />
                      </div>
                    </div>
                  </Form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };

const CreateIcon = (
  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
    <UserIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
  </div>
);

const RemoveIcon = (
  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
    <ExclamationTriangleIcon
      className="h-6 w-6 text-red-600"
      aria-hidden="true"
    />
  </div>
);

export const CreateModal = createModalComponent({
  ModalIcon: CreateIcon,
  CustomButton: SubmitButton,
});

export const RemoveModal = createModalComponent({
  ModalIcon: RemoveIcon,
  CustomButton: RevokeButton,
});
