import { useNavigate, useParams } from "react-router-dom";
import { PaperClipIcon } from '@heroicons/react/24/solid'

import { FormValues, useForm } from "../hooks/useForm";
import Layout from "../components/Layout";
import TextInput from "../components/TextInput";
import SubmitButton from "../components/SubmitButton";
import CancelButton from "../components/CancelButton";
import TextArea from "../components/TextArea";
import PhotoUpload from "../components/PhotoUpload";

export default function BotConfig() {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm([[
    { key: "name" },
    { key: "personality", validation: null }
  ]]);

  const handleCancel = () => {
    navigate("/dashboard");
  }

  const handleUpdate = async ({ name }: FormValues) => {
    // Temporary
    return new Promise<void>(() => {
      return;
    })
  }

  return (
    <Layout title="Config">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
          <span className="block mt-1 text-sm leading-6 text-gray-600">Here you can configure how the bot will behave.</span>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <TextInput
                key="name"
                name="name"
                type="text"
                title="Name"
                form={form}
              />
            </div>

            <div className="col-span-full">
              <TextArea
                key="personality"
                name="personality"
                title="Personality"
                description="Write a few sentences about the bot."
                rows={3}
                form={form}
              />
            </div>

            <div className="col-span-full">
              <PhotoUpload
                title="Photo"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
          <span className="mt-1 text-sm leading-6 text-gray-600">Add documents to train the bot.</span>

          <div className="px-4 py-6 flex flex-col sm:px-0">
            <span className="text-sm font-medium leading-6 text-gray-900">Attachments</span>
            <div className="mt-2 text-sm text-gray-900">
              <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">resume_back_end_developer.pdf</span>
                      <span className="flex-shrink-0 text-gray-400">2.4mb</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="font-medium text-primary-600 hover:text-primary-500">Download</span>
                  </div>
                </li>
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">coverletter_back_end_developer.pdf</span>
                      <span className="flex-shrink-0 text-gray-400">4.5mb</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="font-medium text-primary-600 hover:text-primary-500">Download</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <div className="inline-flex w-full sm:ml-3 sm:w-auto">
          <SubmitButton
            text="Save"
            form={form}
            onPress={handleUpdate}
          />
        </div>
        <div className="inline-flex w-full mt-3 sm:mt-0 sm:ml-3 sm:w-auto">
          <CancelButton
            text="Cancel"
            onPress={handleCancel}
          />
        </div>
      </div>
    </Layout>
  )
}