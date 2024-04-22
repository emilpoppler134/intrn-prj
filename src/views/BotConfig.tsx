import { PaperClipIcon } from "@heroicons/react/24/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { CancelButton, SubmitButton } from "../components/Buttons";
import Form from "../components/Form";
import Loading from "../components/Loading";
import PhotoUpload from "../components/PhotoUpload";
import TextArea from "../components/TextArea";
import TextField from "../components/TextField";
import Warnings from "../components/Warnings";
import ErrorLayout from "../components/layouts/ErrorLayout";
import Layout from "../components/layouts/Layout";
import { ErrorWarning, useWarnings } from "../hooks/useWarnings";
import { Bot } from "../types/Bot";
import { Breadcrumb } from "../types/Breadcrumb";
import { callAPI } from "../utils/apiService";
import isInvalid from "../utils/isInvalid";

const schema = yup.object().shape({
  name: yup.string().required("Name cannot be empty."),
});

type FormFields = yup.InferType<typeof schema>;

export default function BotConfig() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { warnings, pushWarning, removeWarning, clearWarnings } = useWarnings();

  const form = useForm<FormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["botConfig"],
    queryFn: () => callAPI<Bot>("/bots/find", { id }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ name }: FormFields) =>
      callAPI(`/bots/${id}/update`, { name }),
    onSuccess: () => {
      console.log("updated");
    },
    onError: (err: Error) => {
      pushWarning(new ErrorWarning(err.message));
    },
  });

  const handleUpdate = ({ name }: FormFields) => {
    clearWarnings();
    updateMutation.mutate({ name });
  };

  const handleCancel = () => {
    form.reset();
    navigate("/dashboard");
  };

  if (error !== null) return <ErrorLayout error={error} />;
  if (isLoading || data === undefined) return <Loading />;

  const breadcrumb: Breadcrumb = [{ title: data.name }, { title: "Config" }];

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="w-full max-w-4xl mx-auto rounded-lg bg-white p-10 ring-1 ring-inset ring-gray-900/5">
        <Form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="flex flex-col space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile
              </h2>
              <span className="block mt-1 text-sm leading-6 text-gray-600">
                Here you can configure how the bot will behave.
              </span>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <TextField form={form} name="name" key="name" title="Name" />
                </div>

                <div className="col-span-full">
                  <TextArea
                    key="personality"
                    name="personality"
                    title="Personality"
                    description="Write a few sentences about the bot."
                    rows={3}
                  />
                </div>

                <div className="col-span-full">
                  <PhotoUpload />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Personal Information
              </h2>
              <span className="mt-1 text-sm leading-6 text-gray-600">
                Add documents to train the bot.
              </span>

              <div className="px-4 py-6 flex flex-col sm:px-0">
                <span className="text-sm font-medium leading-6 text-gray-900">
                  Attachments
                </span>
                <div className="mt-2 text-sm text-gray-900">
                  <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            resume_back_end_developer.pdf
                          </span>
                          <span className="flex-shrink-0 text-gray-400">
                            2.4mb
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="font-medium text-primary-600 hover:text-primary-500">
                          Download
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            coverletter_back_end_developer.pdf
                          </span>
                          <span className="flex-shrink-0 text-gray-400">
                            4.5mb
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="font-medium text-primary-600 hover:text-primary-500">
                          Download
                        </span>
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
                title="Save"
                type="submit"
                loading={updateMutation.isPending}
                disabled={isInvalid<FormFields>(form)}
              />
            </div>
            <div className="inline-flex w-full mt-3 sm:mt-0 sm:ml-3 sm:w-auto">
              <CancelButton title="Cancel" onPress={handleCancel} />
            </div>
          </div>
        </Form>
      </div>

      <Warnings list={warnings} onClose={(item) => removeWarning(item)} />
    </Layout>
  );
}
