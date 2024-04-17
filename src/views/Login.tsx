import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { PrimaryButton } from "../components/Buttons";
import Checkbox from "../components/Checkbox";
import { Form } from "../components/Form";
import PasswordField from "../components/PasswordField";
import TextField from "../components/TextField";
import AuthLayout from "../components/layouts/AuthLayout";
import { useAuth } from "../provider/authProvider";
import { ExtendedError } from "../utils/ExtendedError";
import { ResponseError } from "../utils/ResponseError";
import { callAPI } from "../utils/apiService";
import isInvalid from "../utils/isInvalid";

const schema = yup.object().shape({
  email: yup.string().required("Email cannot be empty."),
  password: yup.string().required("Password cannot be empty."),
});

type FormFields = yup.InferType<typeof schema>;
type LoginResponse = { token: string };

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [customError, setCustomError] = useState<ExtendedError | null>(null);

  const form = useForm<FormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: FormFields) =>
      callAPI<LoginResponse>("/users/login", { email, password }),
    onSuccess: (response: LoginResponse) => {
      setToken(response.token);
      navigate("/dashboard");
    },
    onError: (err: Error) => {
      setCustomError(
        new ExtendedError(
          err.message,
          err instanceof ResponseError ? true : false,
        ),
      );
    },
  });

  const handleLogin = async ({ email, password }: FormFields) => {
    setCustomError(null);
    loginMutation.mutate({ email, password });
  };

  const handleRememberChange = (checked: boolean) => {
    console.log("Remember me checkbox is checked: " + checked);
  };

  const onGoogleAuthLogin = () => {
    console.log("User requested to login with google");
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
      <Form onSubmit={form.handleSubmit(handleLogin)}>
        <TextField form={form} name="email" key="email" title="Email" />

        <PasswordField
          form={form}
          name="password"
          key="password"
          title="Password"
        />

        <div className="flex items-center justify-between">
          <Checkbox
            name="remember"
            title="Remember me"
            onChange={handleRememberChange}
          />

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            <span>Forgot password?</span>
          </Link>
        </div>

        <PrimaryButton
          title="Login"
          type="submit"
          loading={loginMutation.isPending}
          disabled={isInvalid<FormFields>(form)}
        />
      </Form>
    </AuthLayout>
  );
}
