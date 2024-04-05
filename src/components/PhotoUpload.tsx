import { UserCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

type PhotoUploadProps = {
  title: string;
  description?: string;
};

const PhotoUpload: React.FC<PhotoUploadProps> = ({ title, description }) => {
  return (
    <div>
      <span className="block text-base font-medium leading-6 text-gray-900">
        Photo
      </span>
      <div className="mt-4 flex items-center gap-x-3">
        <UserCircleIcon
          className="h-14 w-14 text-gray-300"
          aria-hidden="true"
        />
        <div className="inline-flex w-full sm:w-auto">
          <button className="CustomButton bg-white hover:bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300">
            <span className="CustomButton-Text text-gray-700">Change</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
