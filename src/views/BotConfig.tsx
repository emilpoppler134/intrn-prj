import { Menu, Transition } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ChatBubbleBottomCenterTextIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  EllipsisHorizontalIcon,
  PaperClipIcon,
} from "@heroicons/react/24/solid";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { NotificationAlert } from "../components/Alerts";
import { CancelButton, SubmitButton } from "../components/Buttons";
import Form from "../components/Form";
import Loading from "../components/Loading";
import PhotoUpload from "../components/PhotoUpload";
import PromptListInput from "../components/PromptListInput";
import RadioCardInput from "../components/RadioCardInput";
import RangeInput from "../components/RangeInput";
import SelectInput from "../components/SelectInput";
import TextField from "../components/TextField";
import Warnings from "../components/Warnings";
import ErrorLayout from "../components/layouts/ErrorLayout";
import Layout from "../components/layouts/Layout";
import { useNotifications } from "../hooks/useNotifications";
import { ErrorWarning, useWarnings } from "../hooks/useWarnings";
import { Bot } from "../types/Bot";
import { Breadcrumb } from "../types/Breadcrumb";
import { Configuration } from "../types/Configuration";
import { Language } from "../types/Language";
import { Model } from "../types/Model";
import { Prompt } from "../types/Prompt";
import { callAPI } from "../utils/apiService";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name cannot be empty."),
  photo: yup.string().nullable(),
  language: yup.string().required("Language is required."),
  prompts: yup
    .array()
    .of(
      yup.object().shape({
        option: yup.string().required(),
        value: yup.string().required(),
      }),
    )
    .min(1, "Personality must be contain at least one item.")
    .required("Personality cannot be empty."),
  configuration: yup.string().required("Configuration is required."),
  model: yup.string().required("Model is required."),
  maxTokens: yup
    .number()
    .min(1, "Max tokens must be at least 1.")
    .max(4096, "Max tokens must be at most 4096."),
  temperature: yup
    .number()
    .min(0.01, "Temperature must be at least 0.01.")
    .max(5, "Temperature must be at most 5."),
  topP: yup
    .number()
    .min(0.01, "Top P must be at least 0.01.")
    .max(1, "Top P must be at most 1."),
});

type FormFields = yup.InferType<typeof schema>;

type QueryResponse = {
  bot: Bot;
  models: Array<Model>;
  configurations: Array<Configuration>;
  prompts: Array<Prompt>;
  languages: Array<Language>;
};

export default function BotConfig() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { warnings, pushWarning, removeWarning, clearWarnings } = useWarnings();
  const { notification } = useNotifications();

  const form = useForm<FormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["botConfig"],
    queryFn: () => callAPI<QueryResponse>("/bots/find", { id }),
  });

  const updateMutation = useMutation({
    mutationFn: (params: FormFields) => callAPI(`/bots/${id}/update`, params),
    onSuccess: () => {
      const notification = {
        title: "Success!",
        message: "Your changes has been saved.",
      };

      navigate(".", {
        state: { notification },
      });

      queryClient.invalidateQueries();
    },
    onError: (err: Error) => {
      pushWarning(new ErrorWarning(err.message));
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => callAPI(`/bots/${id}/remove`),
    onSuccess: () => {
      const notification = {
        title: "Bot removed",
        message: data
          ? `The bot "${data.bot.name}" have been removed.`
          : "The bot has been removed.",
      };

      navigate("/dashboard", {
        state: { notification },
      });
    },
    onError: (err: Error) => {
      pushWarning(new ErrorWarning(err.message));
    },
  });

  const setDefaultValues = () => {
    if (!data) return;
    const bot = data.bot;

    const defaultValues = {
      name: bot.name,
      photo: bot.photo ?? undefined,
      language: bot.language._id,
      prompts: bot.prompts.map((item) => ({
        option: item.option._id,
        value: item.value,
      })),
      configuration: bot.configuration._id,
      model: bot.model._id,
      maxTokens: bot.maxTokens ?? undefined,
      temperature: bot.temperature ?? undefined,
      topP: bot.topP ?? undefined,
    };

    form.reset(defaultValues);
  };

  useEffect(() => setDefaultValues(), [data]);

  const handleUpdate = (params: FormFields) => {
    clearWarnings();
    updateMutation.mutate(params);
  };

  const handleRemove = () => {
    clearWarnings();
    removeMutation.mutate();
  };

  const handleCancel = () => {
    setDefaultValues();
  };

  if (error !== null) return <ErrorLayout error={error} />;
  if (isLoading || data === undefined) return <Loading />;

  const bot = data.bot;
  const languages = data.languages;
  const models = data.models;
  const configurations = data.configurations;
  const prompts = data.prompts;

  const breadcrumb: Breadcrumb = [{ title: bot.name }, { title: "Config" }];

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="w-full max-w-5xl mx-auto mb-12 rounded-b-lg bg-white p-10 ring-1 ring-inset ring-gray-900/5">
        <Form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="flex justify-between items-center pb-6 border-b border-gray-900/10">
            <div className="hover:underline">
              <Link to="/dashboard" className="flex items-center">
                <ArrowLeftIcon className="w-4 h-auto stroke-2 stroke-gray-600" />
                <span className="text-base ml-2 text-gray-600">Go back</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className={classNames(
                  {
                    "opacity-0 pointer-events-none": !form.formState.isDirty,
                  },
                  "mr-2 transition-[opacity] duration-300",
                )}
              >
                <span className="text-sm text-gray-600">Unsaved</span>
              </div>

              <div className="rounded-md hover:bg-gray-100 transition-[background] duration-300">
                <Link to={`/bots/${bot.id}`} className="block py-2 px-3">
                  <div className="flex items-center">
                    <ChatBubbleBottomCenterTextIcon
                      className="w-4 h-4 stroke-gray-600 stroke-2"
                      aria-hidden="true"
                    />
                    <span className="ml-1 text-sm text-gray-600">Chat</span>
                  </div>
                </Link>
              </div>

              <Menu as="div" className="relative">
                <div className="flex w-10 h-10">
                  <Menu.Button className="relative w-full h-full p-2 rounded-md hover:bg-gray-100 transition-[background] duration-300">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <EllipsisHorizontalIcon className="w-full h-full fill-gray-600" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={handleCancel}
                          className={classNames(
                            { "bg-gray-100": active },
                            "w-full flex items-center gap-2 px-3 py-2 select-none",
                          )}
                        >
                          <ArrowPathIcon className="w-4 h-4 stroke-gray-800" />
                          <span className="text-sm text-gray-800">Reset</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={handleRemove}
                          className={classNames(
                            { "bg-gray-100": active },
                            "w-full flex items-center gap-2 px-3 py-2 select-none",
                          )}
                        >
                          <TrashIcon className="w-4 h-4 stroke-red-600" />
                          <span className="text-sm text-red-600">Remove</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div className="flex flex-col space-y-12 mt-6">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile
              </h2>
              <span className="block mt-1 text-sm leading-6 text-gray-600">
                Here you can configure how the bot will behave.
              </span>

              <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <PhotoUpload form={form} name="photo" key="photo" />
                </div>

                <div className="sm:col-span-4">
                  <TextField
                    form={form}
                    key="name"
                    name="name"
                    title="Name"
                    defaultValue
                  />
                </div>

                <div className="sm:col-span-4">
                  <SelectInput
                    name="language"
                    form={form}
                    options={languages.map((item) => ({
                      id: item._id,
                      title: item.title,
                      countryCode: item.country_code,
                    }))}
                  />
                </div>

                <div className="col-span-full">
                  <PromptListInput
                    form={form}
                    name="prompts"
                    key="prompts"
                    title="Personality"
                    description="Write a few sentences about the bot."
                    options={prompts}
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Configuration
              </h2>
              <span className="mt-1 text-sm leading-6 text-gray-600">
                Choose how the bot will behave.
              </span>

              <div className="px-4 py-6 flex flex-col sm:px-0">
                <div className="mt-2">
                  <RadioCardInput
                    form={form}
                    name="configuration"
                    options={configurations}
                  />
                </div>
              </div>

              {configurations.find(
                (item) => item._id === form.getValues("configuration"),
              )?.name === "custom" && (
                <div>
                  <div className="px-4 py-6 flex flex-col sm:px-0">
                    <span className="text-sm font-medium leading-6 text-gray-900">
                      Max Tokens
                    </span>
                    <div className="mt-2">
                      <RangeInput
                        form={form}
                        name="maxTokens"
                        key="maxTokens"
                        min={1}
                        max={4096}
                        step={1}
                      />
                    </div>
                  </div>

                  <div className="px-4 py-6 flex flex-col sm:px-0">
                    <span className="text-sm font-medium leading-6 text-gray-900">
                      Temperature
                    </span>
                    <div className="mt-2">
                      <RangeInput
                        form={form}
                        name="temperature"
                        key="temp"
                        min={0.01}
                        max={5}
                        step={0.01}
                      />
                    </div>
                  </div>

                  <div className="px-4 py-6 flex flex-col sm:px-0">
                    <span className="text-sm font-medium leading-6 text-gray-900">
                      Top P
                    </span>
                    <div className="mt-2">
                      <RangeInput
                        form={form}
                        name="topP"
                        key="topP"
                        min={0.01}
                        max={1}
                        step={0.01}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="px-4 py-6 flex flex-col sm:px-0">
                <span className="text-sm font-medium leading-6 text-gray-900">
                  Llama model
                </span>
                <div className="mt-2">
                  <SelectInput
                    form={form}
                    name="model"
                    key="model"
                    options={models.map((item) => ({
                      id: item._id,
                      title: item.title,
                      description: item.description,
                    }))}
                  />
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
                disabled={!form.formState.isValid || !form.formState.isDirty}
              />
            </div>
            <div className="inline-flex w-full mt-3 sm:mt-0 sm:ml-3 sm:w-auto">
              <CancelButton
                title="Cancel"
                onPress={handleCancel}
                disabled={!form.formState.isValid || !form.formState.isDirty}
              />
            </div>
          </div>
        </Form>
      </div>

      <Warnings list={warnings} onClose={(item) => removeWarning(item)} />

      <NotificationAlert item={notification} />
    </Layout>
  );
}
