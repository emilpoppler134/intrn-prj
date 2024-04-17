import { UserPlusIcon } from "@heroicons/react/24/outline";
import { PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SVGProps, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import BotItem from "../components/BotItem";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import TextField from "../components/TextField";
import WarningAlert from "../components/WarningAlert";
import Layout from "../components/layouts/Layout";
import { useAuth } from "../provider/authProvider";
import { Bot } from "../types/Bot";
import { Breadcrumb } from "../types/Breadcrumb";
import { ErrorCode } from "../types/StatusCode";
import { ExtendedError } from "../utils/ExtendedError";
import { ResponseError } from "../utils/ResponseError";
import { callAPI } from "../utils/apiService";
import isInvalid from "../utils/isInvalid";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name cannot be empty."),
});

type FormFields = yup.InferType<typeof schema>;
type CreateResponse = Bot;

export default function Dashboard() {
  const navigate = useNavigate();

  const { user } = useAuth();
  if (!user) return null;

  const [open, setOpen] = useState<boolean>(false);
  const [customError, setCustomError] = useState<ExtendedError | null>(null);

  const form = useForm<FormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["botList"],
    queryFn: () => callAPI<Array<Bot>>("/bots/list"),
  });

  const createMutation = useMutation({
    mutationFn: ({ name }: FormFields) =>
      callAPI<CreateResponse>("/bots/create", { name }),
    onSuccess: (response: CreateResponse) => {
      const notification = {
        title: "Success!",
        message: "You have created a new bot.",
      };

      navigate(`/bots/${response.id}/config`, {
        state: { notification },
      });
    },
    onError: (err: Error) => {
      if (err instanceof ResponseError && err.status === ErrorCode.CONFLICT) {
        return form.setError("name", {
          message: err.message,
        });
      }

      setCustomError(
        new ExtendedError(
          err.message,
          err instanceof ResponseError ? true : false,
        ),
      );
    },
  });

  const handleCreate = ({ name }: FormFields) => {
    setCustomError(null);
    createMutation.mutate({ name });
  };

  const handleOpen = () => {
    if (user.subscription.status === null) {
      return setCustomError(
        new ExtendedError("You need a subscription to create a bot.", true),
      );
    }

    setOpen(true);
  };

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  const breadcrumb: Breadcrumb = [{ title: "Overview" }];

  if (error !== null) return <Layout breadcrumb={breadcrumb} error={error} />;
  if (isLoading || data === undefined) return <Loading />;

  return (
    <Layout
      breadcrumb={breadcrumb}
      error={customError}
      onErrorClose={() => setCustomError(null)}
    >
      <div className="mx-auto max-w-2xl">
        {data.length > 0 ? (
          <div>
            <span className="px-p text-xl">Avaliable chatbots</span>

            <div className="grid grid-cols-4 gap-12 mt-8">
              {data.map((item) => (
                <BotItem key={item.id} bot={item} />
              ))}

              <div className="flex flex-col">
                <button className="group" onClick={handleOpen}>
                  <div className="flex flex-col">
                    <div className="mb-1">
                      <span className="text-base text-gray-700 text-opacity-0">
                        ‎
                      </span>
                    </div>
                    <div className="relative pb-[100%] outline outline-2 outline-gray-300">
                      <div className="absolute-center p-4">
                        <PlusIcon
                          className="w-12 h-12 fill-gray-700"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div className="text-left mt-2">
                      <span className="text-base font-medium text-gray-600 group-hover:underline">
                        New
                      </span>
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
              <span className="block text-gray-900 text-sm font-semibold mt-2">
                No bots
              </span>
              <span className="block text-gray-500 text-sm mt-1">
                Get started by creating a new bot.
              </span>
              <div className="mt-6">
                <button
                  className="inline-flex items-center rounded-md px-3 py-2 bg-primary-600 hover:bg-primary-700"
                  onClick={handleOpen}
                >
                  <PlusIcon
                    className="w-5 h-5 mr-1 fill-white"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-white">
                    New bot
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        <Modal
          show={open}
          title="New bot"
          Icon={UserIcon as React.FC<SVGProps<SVGElement>>}
          loading={createMutation.isPending}
          disabled={isInvalid<FormFields>(form)}
          onSubmit={form.handleSubmit(handleCreate)}
          onCancel={handleClose}
        >
          <TextField form={form} name="name" key="name" title="Name" />
        </Modal>

        {user.subscription.status === null && (
          <WarningAlert
            message="You dont have a subscription."
            link={{ title: "Start a subscription.", to: "/subscriptions" }}
          />
        )}
      </div>
    </Layout>
  );
}
