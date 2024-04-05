import { MutableRefObject, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import TextInput from "../components/TextInput";
import AuthLayout from "../components/layouts/AuthLayout";
import { FormHook, FormValues, useForm } from "../hooks/useForm";
import { ErrorType, ResponseStatus } from "../types/ApiResponses";
import { callAPI } from "../utils/apiService";
import { emailValidation } from "../utils/validation";

const descriptions: Array<string> = [
  "Please enter the email associated with your account. We'll send a verification code to reset your password.",
  "Check your email inbox for a verification code. Enter the code below to proceed with resetting your password.",
  "Enter a new password for your account.",
];

type StepProps = {
  onConfirmationSubmit: (values: FormValues) => Promise<void>;
  onRequestSubmit: (values: FormValues) => Promise<void>;
  onResetSubmit: (values: FormValues) => Promise<void>;
  reenteredPasswordInputRef: MutableRefObject<HTMLInputElement | null>;
  form: FormHook;
  step: number;
};

const Steps: React.FC<StepProps> = ({ onConfirmationSubmit, onRequestSubmit, onResetSubmit, reenteredPasswordInputRef, form, step }) => {
  switch (step) {
    case 0: {
      const handleEmailEnterKeyPress = async () => {
        await form.handleSubmit(onRequestSubmit);
      };

      return (
        <>
          <TextInput name="email" key="email" type="text" title="Email" form={form} onEnterKeyPress={handleEmailEnterKeyPress} />

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
          <TextInput name="code" key="code" type="text" title="Code" form={form} onEnterKeyPress={handleCodeEnterKeyPress} />

          <SubmitButton text="Next" form={form} onPress={onConfirmationSubmit} />
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
          <TextInput name="password" key="password" type="password" title="New password" form={form} onEnterKeyPress={handlePasswordEnterKeyPress} />

          <TextInput name="reenteredPassword" key="reenteredPassword" type="password" title="Re-enter new password" reference={reenteredPasswordInputRef} form={form} onEnterKeyPress={handleReenteredPasswordEnterKeyPress} />

          <SubmitButton text="Save" form={form} onPress={onResetSubmit} />
        </>
      );
    }

    default: {
      return (
        <>
          <span className="text-base font-medium text-gray-700">Something went wrong.</span>
        </>
      );
    }
  }
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
    step
  );

  const handleRequestSubmit = async ({ email }: FormValues) => {
    setError(null);

    const response = await callAPI("/users/forgot-password-request", { email });

    if (response === null) {
      setError("Something went wrong when the request was sent.");
      return;
    }

    if (response.status === ResponseStatus.ERROR) {
      switch (response.error) {
        case ErrorType.INVALID_PARAMS: {
          setError("Invalid parameters.");
          return;
        }

        case ErrorType.NO_RESULT: {
          setError("A user with that email doesn't exist.");
          return;
        }

        case ErrorType.DATABASE_ERROR: {
          setError("Something went wrong when createing the verification code.");
          return;
        }

        case ErrorType.MAIL_ERROR: {
          setError("Something went wrong when sending the mail.");
          return;
        }

        default: {
          setError("Something went wrong.");
          return;
        }
      }
    }

    setStep(1);
  };

  const handleConfirmationSubmit = async ({ email, code }: FormValues) => {
    setError(null);

    const response = await callAPI("/users/forgot-password-confirmation", {
      email,
      code,
    });

    if (response === null) {
      setError("Something went wrong when the request was sent.");
      return;
    }

    if (response.status === ResponseStatus.ERROR) {
      switch (response.error) {
        case ErrorType.INVALID_PARAMS: {
          setError("Invalid parameters.");
          return;
        }

        case ErrorType.NO_RESULT: {
          setError("The verification code is incorrect.");
          return;
        }

        default: {
          setError("Something went wrong.");
          return;
        }
      }
    }

    setStep(2);
  };

  const handleResetSubmit = async ({ email, code, password, reenteredPassword }: FormValues) => {
    setError(null);

    if (password !== reenteredPassword) {
      setError("Passwords doesn't match.");
      return;
    }

    const response = await callAPI("/users/forgot-password-submit", {
      email,
      code,
      password,
    });

    if (response === null) {
      setError("Something went wrong when the request was sent.");
      return;
    }

    if (response.status === ResponseStatus.ERROR) {
      switch (response.error) {
        case ErrorType.INVALID_PARAMS: {
          setError("Invalid parameters.");
          return;
        }

        case ErrorType.NO_RESULT: {
          setError("The email or the verification code is incorrect.");
          return;
        }

        case ErrorType.HASH_PARSING: {
          setError("Couldn't hash the password you provided.");
          return;
        }

        case ErrorType.DATABASE_ERROR: {
          setError("Something went wrong when updating the password.");
          return;
        }

        default: {
          setError("Something went wrong.");
          return;
        }
      }
    }

    navigate("/login");
  };

  return (
    <AuthLayout description={descriptions[step]} error={error} onErrorClose={() => setError(null)} page="forgot-password" showGoogleAuth={false} title="Forgot password">
      <Steps onConfirmationSubmit={handleConfirmationSubmit} onRequestSubmit={handleRequestSubmit} onResetSubmit={handleResetSubmit} reenteredPasswordInputRef={reenteredPasswordInputRef} form={form} step={step} />
    </AuthLayout>
  );
}
