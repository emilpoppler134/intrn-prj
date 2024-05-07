import {
  ExclamationTriangleIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

type PhotoUploadProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
};

const PhotoUpload = <T extends FieldValues>({
  form,
  name,
}: PhotoUploadProps<T>): JSX.Element => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <div className="flex flex-col space-y-2">
            <div className="mt-4 flex items-center gap-x-3">
              {!value ? (
                <div className="p-2">
                  <UserCircleIcon
                    className="h-20 w-20 text-gray-300"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <div className="relative group p-2 hover:shadow-sm rounded-lg">
                  <img src={value} alt="" className="h-20 w-20" />

                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-[opacity] duration-200">
                    <button
                      type="button"
                      className="w-6 h-6 p-1 bg-gray-100 rounded-md"
                      onClick={() => {
                        onChange(null);
                        form.trigger(name);
                      }}
                    >
                      <XMarkIcon className="w-full h-full fill-gray-500" />

                      <span className="absolute -inset-1.5"></span>
                    </button>
                  </div>
                </div>
              )}
              <div className="group relative cursor-pointer inline-flex w-full sm:w-auto">
                <button
                  type="button"
                  className="pointer-events-none w-full px-4 py-1 rounded-md bg-white group-hover:bg-gray-100 ring-1 ring-gray-300 group-focus-within:ring-4 group-focus-within:ring-primary-300"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    Change
                  </span>
                </button>

                <input
                  type="file"
                  className="appearance-none opacity-0 absolute top-0 left-0 bottom-0 right-0 w-full h-full"
                  accept="image/*"
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files === null || files.length !== 1) return;

                    const reader = new FileReader();

                    reader.onload = () => {
                      if (reader.result === null) return;
                      const image = reader.result.toString();

                      if (new TextEncoder().encode(image).length >= 102400) {
                        return form.setError(name, {
                          message: "Your image is too big, max 100KB",
                        });
                      }

                      onChange(image);
                    };

                    reader.readAsDataURL(files[0]);
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center mt-2">
                <ExclamationTriangleIcon
                  className="w-4 h-4 fill-red-400"
                  aria-hidden="true"
                />
                <span className="block ml-1.5 text-xs text-red-500">
                  {error.message}
                </span>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default PhotoUpload;
