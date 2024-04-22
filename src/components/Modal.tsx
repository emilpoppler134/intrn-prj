import { Dialog, Transition } from "@headlessui/react";
import React, { FormEvent, Fragment, ReactNode, SVGProps, useRef } from "react";
import { CancelButton, SubmitButton } from "./Buttons";
import Form from "./Form";

type ModalProps = {
  children: ReactNode;
  show: boolean;
  title: string;
  Icon: React.FC<SVGProps<SVGElement>>;
  loading: boolean;
  disabled: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

const Modal: React.FC<ModalProps> = ({
  children,
  show,
  title,
  Icon,
  loading,
  disabled,
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
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                        <Icon
                          className="h-6 w-6 text-gray-700"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {title}
                        </Dialog.Title>
                        <div className="mb-6 mt-10">{children}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 px-4 py-3 bg-gray-50 sm:flex-row-reverse sm:px-6">
                    <SubmitButton
                      title="Create"
                      type="submit"
                      loading={loading}
                      disabled={disabled}
                    />

                    <CancelButton title="Cancel" onPress={onCancel} />
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

export default Modal;
