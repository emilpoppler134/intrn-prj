import { Menu, Transition } from "@headlessui/react";
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  PaperClipIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import React, { Fragment } from "react";
import { useAuth } from "../provider/authProvider";
import { FileItem } from "../types/Bot";

type DocumentItemProps = {
  doc: FileItem;
  onRemove: (id: string) => void;
};

const DocumentItem: React.FC<DocumentItemProps> = ({ doc, onRemove }) => {
  const { token } = useAuth();

  const formatSize = (size: number): string => {
    if (size >= 1000000) return size / 1000000 + "mb";
    if (size >= 1000) return size / 1000 + "kb";
    else return size + " bytes";
  };

  const handleOpen = () => {};

  const handleDownload = () => {
    window.open(`${doc.url}?t=${token}`, "_blank");
  };

  const handleRemove = () => {
    onRemove(doc._id);
  };

  return (
    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
      <div className="flex w-0 flex-1 items-center">
        <PaperClipIcon
          className="h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
        <div className="ml-4 flex min-w-0 flex-1 gap-2">
          <span className="truncate font-medium">
            {doc.name}.{doc.type}
          </span>
          <span className="flex-shrink-0 text-gray-400">
            {formatSize(doc.size)}
          </span>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button type="button" onClick={handleDownload}>
          <span className="font-medium text-primary-600 hover:text-primary-500">
            Download
          </span>
        </button>
      </div>

      <Menu as="div" className="relative">
        <div className="flex w-10 h-10 ml-4">
          <Menu.Button className="relative w-full h-full p-2 rounded-md hover:bg-gray-100 transition-[background] duration-300">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open dialog</span>
            <EllipsisHorizontalIcon className="w-full h-full fill-gray-600" />
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
          <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={handleOpen}
                  className={classNames(
                    { "bg-gray-100": active },
                    "w-full flex items-center gap-2 px-3 py-2 select-none",
                  )}
                >
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 stroke-gray-800" />
                  <span className="text-sm text-gray-800">Open</span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={handleDownload}
                  className={classNames(
                    { "bg-gray-100": active },
                    "w-full flex items-center gap-2 px-3 py-2 select-none",
                  )}
                >
                  <ArrowDownTrayIcon className="w-4 h-4 stroke-gray-800" />
                  <span className="text-sm text-gray-800">Download</span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={handleRemove}
                  className={classNames(
                    { "bg-gray-100": active },
                    "w-full flex items-center gap-2 px-3 py-2 select-none",
                  )}
                >
                  <TrashIcon className="w-4 h-4 stroke-red-600" />
                  <span className="text-sm text-red-600">Remove</span>
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
};

export default DocumentItem;
