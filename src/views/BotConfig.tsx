import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PaperClipIcon } from '@heroicons/react/24/solid'

import { FormValues, useForm } from "../hooks/useForm";
import { callAPI } from "../utils/apiService";
import { Bot } from "../types/Bot";
import { ErrorType, ResponseStatus, ValidDataResponse } from "../types/ApiResponses";
import { Breadcrumb } from "../types/Breadcrumb";
import Layout from "../components/Layout";
import TextInput from "../components/TextInput";
import SubmitButton from "../components/SubmitButton";
import CancelButton from "../components/CancelButton";
import TextArea from "../components/TextArea";
import PhotoUpload from "../components/PhotoUpload";
import Loading from "../components/Loading";

export default function BotConfig() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState<string | null>(null);
  const [bot, setBot] = useState<Bot | null | undefined>(undefined);  

  const form = useForm([[
    { key: "name" },
    { key: "personality", validation: null }
  ]]);

  useEffect(() => {
    callAPI<Bot>("/bots/find", { id })
      .then(response => {
        if (response === null) {
          setError("Something went wrong.");
          setBot(null);
          return;
        }

        if (response.status === ResponseStatus.ERROR) {
          setBot(null);

          switch (response.error) {
            case ErrorType.INVALID_PARAMS: {
              setError("Invalid id.");
              return;
            }
    
            case ErrorType.NO_RESULT: {
              setError("No bot with that Id.");
              return;
            }
    
            default: {
              setError("Something went wrong.");
              return;
            }
          }
        }

        const validDataResponse = response as ValidDataResponse & { data: Bot };

        setBot(validDataResponse.data);
      });
  }, [id]);

  const handleCancel = () => {
    navigate("/dashboard");
  }

  const handleUpdate = async ({ name }: FormValues) => {
    // Temporary
    return new Promise<void>(() => {
      return;
    })
  }

  if (bot === null) return <Layout breadcrumb={null} error={error} />;
  if (bot === undefined) return <Loading />;

  const breadcrumb: Breadcrumb = [
    { title: bot.name, to: `/bots/${id}` },
    { title: "Config" }
  ];

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="flex flex-col">
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
      </div>
    </Layout>
  )
}