import { UserPlusIcon } from "@heroicons/react/24/outline";
import { PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import { SVGProps, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BotItem from "../components/BotItem";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import TextInput from "../components/TextInput";
import WarningAlert from "../components/WarningAlert";
import Layout from "../components/layouts/Layout";
import { FormValues, useForm } from "../hooks/useForm";
import { useAuth } from "../provider/authProvider";
import { ErrorType, ResponseStatus, ValidDataResponse } from "../types/ApiResponses";
import { Bot } from "../types/Bot";
import { Breadcrumb } from "../types/Breadcrumb";
import { callAPI } from "../utils/apiService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bots, setBots] = useState<Array<Bot> | null | undefined>(undefined);

  const form = useForm([[{ key: "name" }]]);

  useEffect(() => {
    if (user === null || user === undefined || user.subscription.status === null) {
      setBots([]);
      return;
    }

    callAPI<Array<Bot>>("/bots/list").then((response) => {
      if (response === null || response.status === ResponseStatus.ERROR) {
        setError("Something went wrong.");
        setBots(null);
        return;
      }

      const validDataResponse = response as ValidDataResponse & {
        data: Array<Bot>;
      };

      setBots(validDataResponse.data);
    });
  }, [user]);

  if (!user) return null;

  const handleOpen = () => {
    if (user.subscription.status === null) {
      setError("You need a subscription to create a bot.");
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    form.clearData();
    setOpen(false);
  };

  const handleEnterKeyPress = () => {
    form.handleSubmit(handleCreate);
  };

  const handleCreate = async ({ name }: FormValues) => {
    const response = await callAPI<{ id: string }>("/bots/create", { name });

    if (response === null) {
      setError("Something went wrong.");
      return;
    }

    if (response.status === ResponseStatus.ERROR) {
      switch (response.error) {
        case ErrorType.ALREADY_EXISTING: {
          form.setInvalid("name", true, "That name already exists");
          return;
        }

        default: {
          setError("Something went wrong.");
          return;
        }
      }
    }

    const validDataResponse = response as ValidDataResponse & {
      data: { id: string };
    };

    const notification = {
      title: "Success!",
      message: "You have created a new bot.",
    };

    navigate(`/bots/${validDataResponse.data.id}/config`, {
      state: { notification },
    });
  };

  const breadcrumb: Breadcrumb = [{ title: "Overview" }];

  if (bots === null) return <Layout breadcrumb={null} error={error} />;
  if (bots === undefined) return <Loading />;

  return (
    <Layout breadcrumb={breadcrumb} error={error} onErrorClose={() => setError(null)}>
      <div className="mx-auto max-w-2xl">
        {bots.length > 0 ? (
          <div>
            <span className="px-p text-xl">Avaliable chatbots</span>

            <div className="grid grid-cols-4 gap-12 mt-8">
              {bots.map((item) => (
                <BotItem key={item._id} bot={item} />
              ))}

              <div className="flex flex-col">
                <button className="group" onClick={handleOpen}>
                  <div className="flex flex-col">
                    <div className="mb-1">
                      <span className="text-base text-gray-700 text-opacity-0">‎</span>
                    </div>
                    <div className="relative pb-[100%] outline outline-2 outline-gray-300">
                      <div className="absolute-center p-4">
                        <PlusIcon className="w-12 h-12 fill-gray-700" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="text-left mt-2">
                      <span className="text-base font-medium text-gray-600 group-hover:underline">New</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-12 bg-white rounded-lg ring-1 ring-slate-900/10">
            <div className="flex flex-col items-center">
              <UserPlusIcon className="w-12 h-12 stroke-gray-400" />
              <span className="block text-gray-900 text-sm font-semibold mt-2">No bots</span>
              <span className="block text-gray-500 text-sm mt-1">Get started by creating a new bot.</span>
              <div className="mt-6">
                <button className="inline-flex items-center rounded-md px-3 py-2 bg-primary-600 hover:bg-primary-700" onClick={handleOpen}>
                  <PlusIcon className="w-5 h-5 mr-1 fill-white" aria-hidden="true" />
                  <span className="text-sm font-semibold text-white">New bot</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <Modal show={open} title="New bot" Icon={UserIcon as React.FC<SVGProps<SVGElement>>} form={form} onSubmit={handleCreate} onCancel={handleClose}>
          <TextInput name="name" key="name" type="text" title="Name" form={form} onEnterKeyPress={handleEnterKeyPress} />
        </Modal>

        {user.subscription.status === null && <WarningAlert message="You dont have a subscription." link={{ title: "Start a subscription.", to: "/subscriptions" }} />}
      </div>
    </Layout>
  );
}
