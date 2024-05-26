import { PaperClipIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { FileItem } from "../types/Bot";
import { Icon } from "../types/Icon";
import DocumentItem from "./DocumentItem";
import EmptyState from "./EmptyState";

type DocumentListProps = {
  docs: Array<FileItem>;
  onUpload: (file: File) => Promise<void>;
  onRemove: (id: string) => void;
};

const DocumentList: React.FC<DocumentListProps> = ({
  docs,
  onUpload,
  onRemove,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files === null || files.length !== 1) return;

    setLoading(true);

    await onUpload(files[0]);

    setLoading(false);
  };

  const handleRemove = (id: string) => {
    docs.splice(
      docs.findIndex((doc) => doc._id === id),
      1,
    );
    onRemove(id);
  };

  return (
    <div className="w-full text-sm text-gray-900">
      {docs.length > 0 ? (
        <>
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {docs.map((doc) => (
              <DocumentItem key={doc._id} doc={doc} onRemove={handleRemove} />
            ))}

            {loading && (
              <li className="relative py-4">
                <span className="block h-10"></span>
                <div className="theme-spinner"></div>
              </li>
            )}
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
              accept=".jsonl"
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
              accept=".jsonl"
              onChange={handleUpload}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentList;
