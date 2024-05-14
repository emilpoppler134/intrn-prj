import { PaperClipIcon } from "@heroicons/react/24/outline";
import React from "react";
import { FileItem } from "../types/Bot";
import { Icon } from "../types/Icon";
import DocumentItem from "./DocumentItem";
import EmptyState from "./EmptyState";

type DocumentListProps = {
  files: Array<FileItem>;
  onUpload: (file: File) => void;
  onRemove: (id: string) => void;
};

const DocumentList: React.FC<DocumentListProps> = ({
  files,
  onUpload,
  onRemove,
}) => {
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files === null || files.length !== 1) return;

    onUpload(files[0]);
  };

  return (
    <div className="w-full text-sm text-gray-900">
      {files.length > 0 ? (
        <>
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {files.map((file) => (
              <DocumentItem key={file._id} file={file} onRemove={onRemove} />
            ))}
          </ul>

          <div className="group relative mt-4 cursor-pointer inline-flex w-full sm:w-auto">
            <button
              type="button"
              className="pointer-events-none w-full px-4 py-2 rounded-md bg-white group-hover:bg-gray-100 ring-1 ring-gray-300 group-focus-within:ring-4 group-focus-within:ring-primary-300"
            >
              <span className="text-sm font-semibold text-gray-700">
                Upload
              </span>
            </button>

            <input
              type="file"
              className="appearance-none opacity-0 absolute top-0 left-0 bottom-0 right-0 w-full h-full"
              accept="text/plain, application/json"
              onChange={handleUpload}
            />
          </div>
        </>
      ) : (
        <>
          <div className="relative cursor-pointer w-full filter hover:brightness-95">
            <EmptyState
              Icon={PaperClipIcon as Icon}
              title="New document"
              description="Start fine tuning by uploading a new document."
              buttonTitle="Upload"
              onPress={() => {}}
            />

            <input
              type="file"
              className="appearance-none opacity-0 absolute top-0 left-0 bottom-0 right-0 w-full h-full"
              accept="text/plain, application/json"
              onChange={handleUpload}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentList;
