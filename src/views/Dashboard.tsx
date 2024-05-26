import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { NotificationAlert } from "../components/Alerts";
import BotList from "../components/BotList";
import Loading from "../components/Loading";
import { CreateModal } from "../components/Modal";
import TextField from "../components/TextField";
import Warnings from "../components/Warnings";
import ErrorLayout from "../components/layouts/ErrorLayout";
import Layout from "../components/layouts/Layout";
import { useNotifications } from "../hooks/useNotifications";
import {
  DefaultWarning,
  ErrorWarning,
  useWarnings,
} from "../hooks/useWarnings";
import { useAuth } from "../provider/authProvider";
import { Bot } from "../types/Bot";
import { Breadcrumb } from "../types/Breadcrumb";
import { ErrorCode } from "../types/StatusCode";
import { User } from "../types/User";
import { Warning, WarningType } from "../types/Warning";
import { ControlledError } from "../utils/ControlledError";
import { callAPI } from "../utils/apiService";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name cannot be empty."),
});

type FormFields = yup.InferType<typeof schema>;
type CreateResponse = Bot;

const defaultWarning = (user: User): Warning | undefined => {
  switch (user.subscription.status) {
    case "past_due": {
      return new DefaultWarning("You have an unpaid invoice.", {
        title: "Manage subscription",
        to: "/settings?page=subscription",
      });
    }

    case null: {
      return new DefaultWarning(
        "You dont have a subscription.",
        { title: "Start a subscription", to: "/subscriptions" },
        false,
      );
    }

    default: {
      return undefined;
    }
  }
};

export default function Dashboard() {
  const navigate = useNavigate();

  const { user } = useAuth();
  if (!user) return null;

  const { warnings, pushWarning, removeWarning, clearWarnings } = useWarnings(
    defaultWarning(user),
  );
  const { notification } = useNotifications();

  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["bots"],
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
      if (err instanceof ControlledError && err.status === ErrorCode.CONFLICT) {
        return form.setError("name", {
          message: err.message,
        });
      }

      pushWarning(new ErrorWarning(err.message));
    },
  });

  const handleCreate = ({ name }: FormFields) => {
    clearWarnings(WarningType.Error);
    createMutation.mutate({ name });
  };

  const handleOpen = () => {
    if (user.subscription.status === null) {
      clearWarnings(WarningType.Error);
      pushWarning(new ErrorWarning("You dont have a subscription."));
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  const breadcrumb: Breadcrumb = [{ title: "Overview" }];

  if (error !== null)
    return <ErrorLayout breadcrumb={breadcrumb} error={error} />;
  if (isLoading || data === undefined) return <Loading />;

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="mx-auto max-w-5xl px-6 lg:px-0 mt-6">
        <BotList
          bots={data}
          hasSubscription={user.subscription.status === null}
          onOpen={handleOpen}
        />
      </div>

      <CreateModal
        show={open}
        title="New bot"
        loading={createMutation.isPending}
        disabled={!form.formState.isValid}
        onSubmit={form.handleSubmit(handleCreate)}
        onCancel={handleClose}
      >
        <div className="mb-6 mt-8">
          <TextField form={form} name="name" key="name" title="Name" />
        </div>
      </CreateModal>

      <Warnings list={warnings} onClose={(item) => removeWarning(item)} />
      <NotificationAlert item={notification} />
    </Layout>
  );
}
