import React, { useState, Fragment, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'
import { UserIcon, PlusIcon } from '@heroicons/react/24/solid';

import { Bot } from '../types/Bot';
import { useForm, FormValues } from '../hooks/useForm';
import TextInput from './TextInput';
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';

type BotListOverviewProps = {
  bots: Array<Bot>;
}

const BotListOverview: React.FC<BotListOverviewProps> = ({ bots }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const cancelButtonRef = useRef(null)

  const form = useForm([[
    { key: "name" }
  ]]);

  const handleCancel = () => {
    form.clearData();
    setOpen(false);
  }

  const handleNameEnterKeyPress = () => {
    form.handleSubmit(handleCreate);
  }

  const handleCreate = ({ name }: FormValues) => {
    // Temporary
    return new Promise<void>(() => {
      navigate("/bots/zzz-zzzz-zzzzzzz-zzzz/config");
      return;
    })
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-12 mt-8">
        {bots.map(item => (
          <div key={item._id} className="flex flex-col">
            <Link to={`/bots/${item._id}`} className="group">
              <div className="flex flex-col">
                <div className="relative pb-[100%] outline outline-2 outline-gray-300">
                  <div className="absolute-center w-full h-full p-4">
                    <UserIcon className="w-full h-full fill-gray-700" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-base font-medium text-primary-600 group-hover:underline dark:text-primary-500">Chat</span>
                </div>
              </div>
            </Link>
            <Link to={`/bots/${item._id}/config`}>
              <span className="text-base font-medium text-primary-600 hover:underline dark:text-primary-500">Config</span>
            </Link>
          </div>
        ))}
        
        <div className="flex flex-col">
          <button
            className="group"
            onClick={() => setOpen(true)}
          >
            <div className="flex flex-col">
              <div className="relative pb-[100%] outline outline-2 outline-gray-300">
                <div className="absolute-center p-4">
                  <PlusIcon className="w-12 h-12 fill-gray-700" aria-hidden="true" />
                </div>
              </div>
              <div className="text-left mt-2">
                <span className="text-base font-medium text-gray-600 group-hover:underline">New</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                        <UserIcon className="h-6 w-6 text-gray-700" aria-hidden="true" />
                      </div>
                      <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          New bot
                        </Dialog.Title>
                        <div className="mb-6 mt-10">
                          <TextInput 
                            name="name"
                            key="name"
                            type="text"
                            title="Name"
                            form={form}
                            onEnterKeyPress={handleNameEnterKeyPress}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <div className="inline-flex w-full sm:ml-3 sm:w-auto">
                      <SubmitButton
                        text="Create"
                        form={form}
                        onPress={handleCreate}
                      />
                    </div>
                    <div className="inline-flex w-full mt-3 sm:mt-0 sm:ml-3 sm:w-auto">
                      <CancelButton
                        text="Cancel"
                        reference={cancelButtonRef}
                        onPress={handleCancel}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default BotListOverview;
