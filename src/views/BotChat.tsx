import { useParams } from "react-router-dom";
import { PaperAirplaneIcon, UserCircleIcon } from "@heroicons/react/24/solid";

import { useForm, FormValues } from "../hooks/useForm";
import Layout from "../components/Layout";
import TextInput from "../components/TextInput";
import { SVGProps } from "react";
import { Breadcrumb } from "../types/Breadcrumb";

export default function BotChat() {
  const { id } = useParams();

  const form = useForm([[
    { key: "message", validation: null }
  ]]);

  const handleEnterKeyPress = () => {
    form.handleSubmit(handleSend);
  }

  const handleInputButtonPress = () => {
    form.handleSubmit(handleSend);
  }

  const handleSend = ({ message }: FormValues) => {
    return new Promise<void>((resolve, reject) => {
      console.log(message)
      return;
    })
  }

  const breadcrumb: Breadcrumb = [
    { title: "Bot Karin", to: `/bots/${id}/config` },
    { title: "Chat" }
  ];

  return (
    <Layout breadcrumb={breadcrumb} backgroundColor="gray-50">
      <div className="flex flex-col items-start gap-6 w-full bg-white rounded-lg shadow p-6 dark:border md:mt-0 sm:max-w-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center w-full space-x-4 pb-6 border-b-2 border-gray-100">
          <div className="grid place-items-center">
            <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="mt-1 flex items-center">
              <span className="text-sm font-semibold text-gray-900">Anderson Vanhron</span>
            </div>
            <span className="text-sm text-gray-600">Junior Developer</span>
          </div>
        </div>
        
        <div className="flex-1 w-full pb-6 border-b-2 border-gray-100">

          <div className="flex items-start gap-2.5">
            <UserCircleIcon className="h-8 w-8 text-gray-300" aria-hidden="true" />
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                </div>
                <span className="block text-sm font-normal py-2.5 text-gray-900 dark:text-white">That's awesome. I think our users will really appreciate the improvements.</span>
            </div>
          </div>

        </div>
        <div className="w-full">
          <TextInput
            key="message"
            name="message"
            type="text"
            title="Message"
            form={form}
            onEnterKeyPress={handleEnterKeyPress}
            RightButtonIcon={PaperAirplaneIcon as React.FC<SVGProps<SVGElement>>}
            onRightButtonPress={handleInputButtonPress}
          />
        </div>
      </div>
    </Layout>
  )
}