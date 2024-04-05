import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "../components/Checkbox";
import SubmitButton from "../components/SubmitButton";
import TextInput from "../components/TextInput";
import AuthLayout from "../components/layouts/AuthLayout";
import { FormValues, useForm } from "../hooks/useForm";
import { useAuth } from "../provider/authProvider";
import { ErrorType, ResponseStatus, ValidDataResponse } from "../types/ApiResponses";
import { callAPI } from "../utils/apiService";
import { emailValidation } from "../utils/validation";

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm([
    [
      {
        key: "email",
        helperText: "Enter a valid email.",
        validation: emailValidation,
      },
      { key: "password" },
    ],
  ]);

  const handleRememberChange = (checked: boolean) => {
    console.log("Remember me checkbox is checked: " + checked);
  };

  const onGoogleAuthLogin = () => {
    console.log("User requested to login with google");
  };

  const handleEmailEnterKeyPress = async () => {
    passwordInputRef?.current?.focus();
  };

  const handlePasswordEnterKeyPress = async () => {
    await form.handleSubmit(handleLogin);
  };

  const handleLogin = async ({ email, password }: FormValues) => {
    setError(null);

    const response = await callAPI<{ token: string }>("/users/login", {
      email,
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

        case ErrorType.HASH_PARSING: {
          setError("Couldn't hash the password you provided.");
          return;
        }

        case ErrorType.NO_RESULT: {
          setError("The email or password are incorrect.");
          return;
        }

        case ErrorType.DATABASE_ERROR: {
          setError("Something went wrong when createing the access token.");
          return;
        }

        default: {
          setError("Something went wrong.");
          return;
        }
      }
    }

    const validDataResponse = response as ValidDataResponse & {
      data: { token: string };
    };

    setToken(validDataResponse.data.token);
    navigate("/dashboard");
  };

  return (
    <AuthLayout error={error} onErrorClose={() => setError(null)} onGoogleAuthClick={onGoogleAuthLogin} page="login" showGoogleAuth={true} title="Sign in to your account">
      <TextInput name="email" key="email" type="text" title="Email" form={form} onEnterKeyPress={handleEmailEnterKeyPress} />

      <TextInput name="password" key="password" type="password" title="Password" reference={passwordInputRef} form={form} onEnterKeyPress={handlePasswordEnterKeyPress} />

      <div className="flex items-center justify-between">
        <Checkbox name="remember" title="Remember me" onChange={handleRememberChange} />

        <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
          <span>Forgot password?</span>
        </Link>
      </div>

      <SubmitButton text="Login" form={form} onPress={handleLogin} />
    </AuthLayout>
  );
}
