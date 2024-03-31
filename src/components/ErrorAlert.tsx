import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

type Props = {
  message: string;
  onClose(): void;
}

const ErrorAlert: React.FC<Props> = ({ message, onClose }) => {
  const handleButtonClick = () => {
    onClose();
  }

  return (
    <div className="fixed top-4 left-2/4 translate-x-[-50%] w-full max-w-xl z-30">
      <div className="p-4 shadow-lg bg-red-50 border-l-4 border-red-400">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="w-5 h-5 fill-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <span className="block text-sm text-red-700">
              <span>{message}</span>
            </span>
          </div>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-2"
            onClick={handleButtonClick}
          >
            <XMarkIcon className="h-6 w-6 stroke-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorAlert;