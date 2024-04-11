import { useMutation } from "@tanstack/react-query";
import { MutableRefObject, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import TextInput from "../components/TextInput";
import AuthLayout from "../components/layouts/AuthLayout";
import { FormHook, FormValues, useForm } from "../hooks/useForm";
import { ExtendedError } from "../utils/ExtendedError";
import { ResponseError } from "../utils/ResponseError";
import { callAPI } from "../utils/apiService";
import { emailValidation } from "../utils/validation";

const descriptions: Array<string> = [
  "Please enter the email associated with your account. We'll send a verification code to reset your password.",
  "Check your email inbox for a verification code. Enter the code below to proceed with resetting your password.",
  "Enter a new password for your account.",
];

type RequestParams = {
  email: string;
};

type ConfirmParams = {
  email: string;
  code: string;
};

type SubmitParams = {
  email: string;
  code: string;
  password: string;
};

type StepProps = {
  onConfirmationSubmit: (values: FormValues) => Promise<void>;
  onRequestSubmit: (values: FormValues) => Promise<void>;
  onResetSubmit: (values: FormValues) => Promise<void>;
  reenteredPasswordInputRef: MutableRefObject<HTMLInputElement | null>;
  form: FormHook;
  step: number;
};

const Steps: React.FC<StepProps> = ({
  onConfirmationSubmit,
  onRequestSubmit,
  onResetSubmit,
  reenteredPasswordInputRef,
  form,
  step,
}) => {
  switch (step) {
    case 0: {
      const handleEmailEnterKeyPress = async () => {
        await form.handleSubmit(onRequestSubmit);
      };

      return (
        <>
          <TextInput
            name="email"
            key="email"
            type="text"
            title="Email"
            form={form}
            onEnterKeyPress={handleEmailEnterKeyPress}
          />

          <SubmitButton text="Next" form={form} onPress={onRequestSubmit} />
        </>
      );
    }

    case 1: {
      const handleCodeEnterKeyPress = async () => {
        await form.handleSubmit(onConfirmationSubmit);
      };

      return (
        <>
          <TextInput
            name="code"
            key="code"
            type="text"
            title="Code"
            form={form}
            onEnterKeyPress={handleCodeEnterKeyPress}
          />

          <SubmitButton
            text="Next"
            form={form}
            onPress={onConfirmationSubmit}
          />
        </>
      );
    }

    case 2: {
      const handlePasswordEnterKeyPress = async () => {
        reenteredPasswordInputRef?.current?.focus();
      };

      const handleReenteredPasswordEnterKeyPress = async () => {
        await form.handleSubmit(onResetSubmit);
      };

      return (
        <>
          <TextInput
            name="password"
            key="password"
            type="password"
            title="New password"
            form={form}
            onEnterKeyPress={handlePasswordEnterKeyPress}
          />

          <TextInput
            name="reenteredPassword"
            key="reenteredPassword"
            type="password"
            title="Re-enter new password"
            reference={reenteredPasswordInputRef}
            form={form}
            onEnterKeyPress={handleReenteredPasswordEnterKeyPress}
          />

          <SubmitButton text="Save" form={form} onPress={onResetSubmit} />
        </>
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

  const form = useForm(
    [
      [
        {
          key: "email",
          helperText: "Enter a valid email.",
          validation: emailValidation,
        },
      ],
      [{ key: "code" }],
      [{ key: "password" }, { key: "reenteredPassword" }],
    ],
    step,
  );

  const requestMutation = useMutation({
    mutationFn: ({ email }: RequestParams) =>
      callAPI("/users/forgot-password-request", { email }),
  });

  const confirmMutation = useMutation({
    mutationFn: ({ email, code }: ConfirmParams) =>
      callAPI("/users/forgot-password-confirmation", { email, code }),
  });

  const submitMutation = useMutation({
    mutationFn: ({ email, code, password }: SubmitParams) =>
      callAPI("/users/forgot-password-submit", { email, code, password }),
  });

  const handleRequestSubmit = async ({ email }: FormValues) => {
    setError(null);

    try {
      await requestMutation.mutateAsync({ email });

      setStep(1);
    } catch (err: unknown) {
      if (err instanceof ResponseError) {
        return setError(new ExtendedError(err.message, true));
      }

      if (err instanceof Error) {
        return setError(new ExtendedError(err.message, false));
      }
    }
  };

  const handleConfirmationSubmit = async ({ email, code }: FormValues) => {
    setError(null);

    try {
      await confirmMutation.mutateAsync({ email, code });

      setStep(2);
    } catch (err: unknown) {
      if (err instanceof ResponseError) {
        return setError(new ExtendedError(err.message, true));
      }

      if (err instanceof Error) {
        return setError(new ExtendedError(err.message, false));
      }
    }
  };

  const handleResetSubmit = async ({
    email,
    code,
    password,
    reenteredPassword,
  }: FormValues) => {
    setError(null);

    if (password !== reenteredPassword) {
      return setError(new ExtendedError("Passwords doesn't match.", true));
    }

    try {
      await submitMutation.mutateAsync({ email, code, password });

      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof ResponseError) {
        return setError(new ExtendedError(err.message, true));
      }

      if (err instanceof Error) {
        return setError(new ExtendedError(err.message, false));
      }
    }
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
        onConfirmationSubmit={handleConfirmationSubmit}
        onRequestSubmit={handleRequestSubmit}
        onResetSubmit={handleResetSubmit}
        reenteredPasswordInputRef={reenteredPasswordInputRef}
        form={form}
        step={step}
      />
    </AuthLayout>
  );
}
