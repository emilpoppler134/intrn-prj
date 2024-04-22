import { PaperAirplaneIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SVGProps } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import Form from "../components/Form";
import Loading from "../components/Loading";
import TextField from "../components/TextField";
import Warnings from "../components/Warnings";
import ErrorLayout from "../components/layouts/ErrorLayout";
import Layout from "../components/layouts/Layout";
import { ErrorWarning, useWarnings } from "../hooks/useWarnings";
import { Bot } from "../types/Bot";
import { Breadcrumb } from "../types/Breadcrumb";
import { callAPI } from "../utils/apiService";

const schema = yup.object().shape({
  message: yup.string().trim().required("You cant send an empty message."),
});

type FormFields = yup.InferType<typeof schema>;
type ChatResponse = { message: string };

export default function BotChat() {
  const { id } = useParams();

  const { warnings, pushWarning, removeWarning, clearWarnings } = useWarnings();

  const { data, error, isLoading } = useQuery({
    queryKey: ["botChat"],
    queryFn: () => callAPI<Bot>("/bots/find", { id }),
  });

  const form = useForm<FormFields>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const chatMutation = useMutation({
    mutationFn: ({ message }: FormFields) =>
      callAPI<ChatResponse>(`/bots/${id}/chat`, { message }),
    onSuccess: (response: ChatResponse) => {},
    onError: (err: Error) => {
      pushWarning(new ErrorWarning(err.message));
    },
  });

  const handleSend = async ({ message }: FormFields) => {
    clearWarnings();
    chatMutation.mutate({ message });
  };

  if (error !== null) return <ErrorLayout error={error} />;
  if (isLoading || data === undefined) return <Loading />;

  const breadcrumb: Breadcrumb = [
    { title: data.name, to: `/bots/${data.id}/config` },
    { title: "Chat" },
  ];

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="flex flex-col items-start gap-6 w-full bg-white rounded-lg shadow p-6 md:mt-0 sm:max-w-lg">
        <div className="flex items-center w-full space-x-4 pb-6 border-b-2 border-gray-100">
          <div className="grid place-items-center">
            <UserCircleIcon
              className="h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="mt-1 flex items-center">
              <span className="text-sm font-semibold text-gray-900">Name</span>
            </div>
            <span className="text-sm text-gray-600">Underline</span>
          </div>
        </div>

        <div className="flex-1 w-full pb-6 border-b-2 border-gray-100">
          <div className="flex items-start gap-2.5">
            <UserCircleIcon
              className="h-8 w-8 text-gray-300"
              aria-hidden="true"
            />
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900">
                  Name
                </span>
                <span className="text-sm font-normal text-gray-500">11:46</span>
              </div>
              <span className="block text-sm font-normal py-2.5 text-gray-900">
                That's awesome. I think our users will really appreciate the
                improvements.
              </span>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Form onSubmit={form.handleSubmit(handleSend)}>
            <TextField
              form={form}
              name="message"
              key="message"
              title="Message"
              iconRight
              Icon={PaperAirplaneIcon as React.FC<SVGProps<SVGElement>>}
            />
          </Form>
        </div>
      </div>

      <Warnings list={warnings} onClose={(item) => removeWarning(item)} />
    </Layout>
  );
}
