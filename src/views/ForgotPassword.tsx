import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { PrimaryButton } from "../components/Buttons";
import { Form } from "../components/Form";
import PasswordField from "../components/PasswordField";
import TextField from "../components/TextField";
import AuthLayout from "../components/layouts/AuthLayout";
import { ExtendedError } from "../utils/ExtendedError";
import { ResponseError } from "../utils/ResponseError";
import { callAPI } from "../utils/apiService";
import isInvalid from "../utils/isInvalid";

const requestSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email is invalid.")
    .required("Email cannot be empty."),
});

const confirmSchema = yup.object().shape({
  code: yup.string().required("Code cannot be empty."),
});

const submitSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .required("Password cannot be empty."),
  rePassword: yup.string().required("Re-entered password cannot be empty."),
});

type RequestFormFields = yup.InferType<typeof requestSchema>;
type ConfirmFormFields = yup.InferType<typeof confirmSchema>;
type SubmitFormFields = yup.InferType<typeof submitSchema>;

type RequestParams = RequestFormFields;
type ConfirmParams = RequestFormFields & ConfirmFormFields;
type SubmitParams = RequestFormFields &
  ConfirmFormFields &
  Omit<SubmitFormFields, "rePassword">;

type StepProps = {
  confirmDisabled: boolean;
  confirmForm: UseFormReturn<ConfirmFormFields>;
  confirmLoading: boolean;
  requestDisabled: boolean;
  requestForm: UseFormReturn<RequestFormFields>;
  requestLoading: boolean;
  submitDisabled: boolean;
  submitForm: UseFormReturn<SubmitFormFields>;
  submitLoading: boolean;
  onRequest: (fields: RequestFormFields) => void;
  onConfirm: (fields: ConfirmFormFields) => void;
  onSubmit: (fields: SubmitFormFields) => void;
  step: number;
};

const descriptions: Array<string> = [
  "Please enter the email associated with your account. We'll send a verification code to reset your password.",
  "Check your email inbox for a verification code. Enter the code below to proceed with resetting your password.",
  "Enter a new password for your account.",
];

const Steps: React.FC<StepProps> = ({
  confirmDisabled,
  confirmForm,
  confirmLoading,
  requestDisabled,
  requestForm,
  requestLoading,
  submitDisabled,
  submitForm,
  submitLoading,
  onRequest,
  onConfirm,
  onSubmit,
  step,
}) => {
  switch (step) {
    case 0: {
      return (
        <Form onSubmit={requestForm.handleSubmit(onRequest)}>
          <TextField
            form={requestForm}
            name="email"
            key="email"
            title="Email"
          />

          <PrimaryButton
            title="Next"
            type="submit"
            loading={requestLoading}
            disabled={requestDisabled}
          />
        </Form>
      );
    }

    case 1: {
      return (
        <Form onSubmit={confirmForm.handleSubmit(onConfirm)}>
          <TextField
            form={confirmForm}
            name="code"
            key="code"
            title="Verification code"
          />

          <PrimaryButton
            title="Next"
            type="submit"
            loading={confirmLoading}
            disabled={confirmDisabled}
          />
        </Form>
      );
    }

    case 2: {
      return (
        <Form onSubmit={submitForm.handleSubmit(onSubmit)}>
          <PasswordField
            form={submitForm}
            name="password"
            key="password"
            title="New password"
          />

          <PasswordField
            form={submitForm}
            name="rePassword"
            key="rePassword"
            title="Re-enter new password"
          />

          <PrimaryButton
            title="Save"
            type="submit"
            loading={submitLoading}
            disabled={submitDisabled}
          />
        </Form>
      );
    }

    default: {
      return (
        <>
          <span className="text-base font-medium text-gray-700">
            Something went wrong.
          </span>
        </>
      );
    }
  }
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<ExtendedError | null>(null);

  const reenteredPasswordInputRef = useRef<HTMLInputElement | null>(null);

  const requestForm = useForm<RequestFormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(requestSchema),
  });

  const confirmForm = useForm<ConfirmFormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(confirmSchema),
  });

  const submitForm = useForm<SubmitFormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(submitSchema),
  });

  const requestMutation = useMutation({
    mutationFn: ({ email }: RequestParams) =>
      callAPI("/users/forgot-password-request", { email }),
    onSuccess: () => {
      setStep(1);
    },
    onError: (err: Error) => {
      setError(
        new ExtendedError(
          err.message,
          err instanceof ResponseError ? true : false,
        ),
      );
    },
  });

  const confirmMutation = useMutation({
    mutationFn: ({ email, code }: ConfirmParams) =>
      callAPI("/users/forgot-password-confirm", { email, code }),
    onSuccess: () => {
      setStep(2);
    },
    onError: (err: Error) => {
      setError(
        new ExtendedError(
          err.message,
          err instanceof ResponseError ? true : false,
        ),
      );
    },
  });

  const submitMutation = useMutation({
    mutationFn: ({ email, code, password }: SubmitParams) =>
      callAPI("/users/forgot-password-request", { email, code, password }),
    onSuccess: () => {
      navigate("/login");
    },
    onError: (err: Error) => {
      setError(
        new ExtendedError(
          err.message,
          err instanceof ResponseError ? true : false,
        ),
      );
    },
  });

  const handleRequest = ({ email }: RequestFormFields) => {
    setError(null);
    requestMutation.mutate({ email });
  };

  const handleConfirm = ({ code }: ConfirmFormFields) => {
    setError(null);
    const email = requestForm.getValues().email;
    confirmMutation.mutate({ email, code });
  };

  const handleSubmit = ({ password, rePassword }: SubmitFormFields) => {
    setError(null);

    const email = requestForm.getValues().email;
    const code = confirmForm.getValues().code;

    if (password !== rePassword) {
      return submitForm.setError("rePassword", {
        message: "Passwords doesn't match.",
      });
    }

    submitMutation.mutate({ email, code, password });
  };

  return (
    <AuthLayout
      description={descriptions[step]}
      error={error}
      onErrorClose={() => setError(null)}
      page="forgot-password"
      showGoogleAuth={false}
      title="Forgot password"
    >
      <Steps
        requestLoading={requestMutation.isPending}
        confirmLoading={confirmMutation.isPending}
        submitLoading={submitMutation.isPending}
        requestDisabled={isInvalid<RequestFormFields>(requestForm)}
        confirmDisabled={isInvalid<ConfirmFormFields>(confirmForm)}
        submitDisabled={isInvalid<SubmitFormFields>(submitForm)}
        requestForm={requestForm}
        confirmForm={confirmForm}
        submitForm={submitForm}
        onRequest={handleRequest}
        onConfirm={handleConfirm}
        onSubmit={handleSubmit}
        step={step}
      />
    </AuthLayout>
  );
}
