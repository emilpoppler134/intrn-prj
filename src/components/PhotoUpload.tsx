import { UserCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

type PhotoUploadProps = {};

const PhotoUpload: React.FC<PhotoUploadProps> = () => {
  return (
    <div className="mt-4 flex items-center gap-x-3">
      <UserCircleIcon className="h-20 w-20 text-gray-300" aria-hidden="true" />
      <div className="inline-flex w-full sm:w-auto">
        <button
          type="button"
          className="relative w-full px-4 py-1 rounded-md bg-white hover:bg-gray-100 ring-1 ring-gray-300 focus:ring-4 focus:ring-primary-300"
        >
          <span className="text-sm font-semibold text-gray-700 pointer-events-none">
            Change
          </span>
        </button>
      </div>
    </div>
  );
};

export default PhotoUpload;
