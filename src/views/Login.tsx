import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "../components/Checkbox";
import SubmitButton from "../components/SubmitButton";
import TextInput from "../components/TextInput";
import AuthLayout from "../components/layouts/AuthLayout";
import { FormValues, useForm } from "../hooks/useForm";
import { useAuth } from "../provider/authProvider";
import { ErrorCode } from "../types/StatusCode";
import { ExtendedError } from "../utils/ExtendedError";
import { ResponseError } from "../utils/ResponseError";
import { callAPI } from "../utils/apiService";
import { emailValidation } from "../utils/validation";

type MutationParams = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [customError, setCustomError] = useState<ExtendedError | null>(null);

  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: MutationParams) =>
      callAPI<LoginResponse>("/users/login", { email, password }),
  });

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
    setCustomError(null);

    try {
      const response = await loginMutation.mutateAsync({ email, password });

      setToken(response.token);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof ResponseError) {
        switch (err.status) {
          case ErrorCode.NO_RESULT: {
            console.log(err.message);
          }
        }

        return setCustomError(new ExtendedError(err.message, true));
      }

      if (err instanceof Error) {
        return setCustomError(new ExtendedError(err.message, false));
      }
    }
  };

  return (
    <AuthLayout
      error={customError}
      onErrorClose={() => setCustomError(null)}
      onGoogleAuthClick={onGoogleAuthLogin}
      page="login"
      showGoogleAuth={true}
      title="Sign in to your account"
    >
      <TextInput
        name="email"
        key="email"
        type="text"
        title="Email"
        form={form}
        onEnterKeyPress={handleEmailEnterKeyPress}
      />

      <TextInput
        name="password"
        key="password"
        type="password"
        title="Password"
        reference={passwordInputRef}
        form={form}
        onEnterKeyPress={handlePasswordEnterKeyPress}
      />

      <div className="flex items-center justify-between">
        <Checkbox
          name="remember"
          title="Remember me"
          onChange={handleRememberChange}
        />

        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          <span>Forgot password?</span>
        </Link>
      </div>

      <SubmitButton text="Login" form={form} onPress={handleLogin} />
    </AuthLayout>
  );
}
