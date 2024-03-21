import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
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
    <div className="error-alert">
      <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <ExclamationTriangleIcon className="mr-2 w-5 h-5 fill-red-500" />
        <span className="block sm:inline">{message}</span>
        <button
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={handleButtonClick}
        >
          <XMarkIcon className="h-6 w-6 fill-red-500" />
        </button>
      </div>
    </div>
  );
}

export default ErrorAlert;