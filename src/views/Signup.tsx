import { MutableRefObject, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import TextInput from "../components/TextInput";
import AuthLayout from "../components/layouts/AuthLayout";
import { FormHook, FormValues, useForm } from "../hooks/useForm";
import { useAuth } from "../provider/authProvider";
import {
  ErrorType,
  ResponseStatus,
  ValidDataResponse,
} from "../types/ApiResponses";
import { callAPI } from "../utils/apiService";
import { emailValidation } from "../utils/validation";

const descriptions: Array<string> = [
  "Please enter your full name and your email. We'll send a verification code to your email.",
  "Check your email inbox for a verification code. Enter the code below to proceed with creating your account.",
  "Enter a new password for your account.",
];

type StepProps = {
  onConfirmationSubmit: (values: FormValues) => Promise<void>;
  onRequestSubmit: (values: FormValues) => Promise<void>;
  onSignupSubmit: (values: FormValues) => Promise<void>;
  emailInputRef: MutableRefObject<HTMLInputElement | null>;
  reenteredPasswordInputRef: MutableRefObject<HTMLInputElement | null>;
  form: FormHook;
  step: number;
};

const Steps: React.FC<StepProps> = ({
  onConfirmationSubmit,
  onRequestSubmit,
  onSignupSubmit,
  emailInputRef,
  reenteredPasswordInputRef,
  form,
  step,
}) => {
  switch (step) {
    case 0: {
      const handleNameEnterKeyPress = async () => {
        emailInputRef?.current?.focus();
      };

      const handleEmailEnterKeyPress = async () => {
        await form.handleSubmit(onRequestSubmit);
      };

      return (
        <>
          <TextInput
            name="name"
            key="name"
            type="text"
            title="Name"
            form={form}
            onEnterKeyPress={handleNameEnterKeyPress}
          />

          <TextInput
            name="email"
            key="email"
            type="text"
            title="Email"
            reference={emailInputRef}
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
            title="Verification code"
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
        await form.handleSubmit(onSignupSubmit);
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

          <SubmitButton text="Save" form={form} onPress={onSignupSubmit} />
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

export default function Signup() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showGoogleSignup, setShowGoogleSignup] = useState<boolean>(true);

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const reenteredPasswordInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm(
    [
      [
        { key: "name" },
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

  const onGoogleAuthSignup = () => {
    console.log("User requested to signup with google");
  };

  const handleRequestSubmit = async ({ name, email }: FormValues) => {
    setError(null);

    const response = await callAPI("/users/signup-request", { name, email });

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

        case ErrorType.ALREADY_EXISTING: {
          setError(
            "That email is already in use. Please try signing in, or use a different email.",
          );
          return;
        }

        case ErrorType.DATABASE_ERROR: {
          setError(
            "Something went wrong when createing the verification code.",
          );
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

    setShowGoogleSignup(false);
    setStep(1);
  };

  const handleConfirmationSubmit = async ({ email, code }: FormValues) => {
    setError(null);

    const response = await callAPI("/users/signup-confirmation", {
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
          setError("The reset code are incorrect.");
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

  const handleSignupSubmit = async ({
    name,
    email,
    code,
    password,
    reenteredPassword,
  }: FormValues) => {
    setError(null);

    if (password !== reenteredPassword) {
      setError("Passwords doesn't match.");
      return;
    }

    const response = await callAPI<{ token: string }>("/users/signup-submit", {
      name,
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

        case ErrorType.ALREADY_EXISTING: {
          setError(
            "That email is already in use. Please try signing in, or use a different email.",
          );
          return;
        }

        case ErrorType.NO_RESULT: {
          setError("The Verification code are incorrect.");
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

    const validDataResponse = response as ValidDataResponse & { token: string };

    setToken(validDataResponse.data.accessToken);
    navigate("/dashboard");
  };

  return (
    <AuthLayout
      description={descriptions[step]}
      error={error}
      onErrorClose={() => setError(null)}
      onGoogleAuthClick={onGoogleAuthSignup}
      page="signup"
      showGoogleAuth={showGoogleSignup}
      title="Create a new account"
    >
      <Steps
        onRequestSubmit={handleRequestSubmit}
        onConfirmationSubmit={handleConfirmationSubmit}
        onSignupSubmit={handleSignupSubmit}
        emailInputRef={emailInputRef}
        reenteredPasswordInputRef={reenteredPasswordInputRef}
        form={form}
        step={step}
      />
    </AuthLayout>
  );
}
