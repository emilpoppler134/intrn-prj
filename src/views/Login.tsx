import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

import { API_ADDRESS } from '../config';
import { ApiResponse, ResponseStatus, ErrorType } from '../types/ApiResponses';
import { emailValidation } from '../utils/validation';
import { useAuth } from '../provider/authProvider';
import { useForm, FormValues } from '../hooks/useForm';
import AuthLayout from '../components/AuthLayout';
import Checkbox from '../components/Checkbox';
import SubmitButton from '../components/SubmitButton';
import TextInput from '../components/TextInput';

type LoginResponse = (Omit<ApiResponse, 'data'> & {data?: { accessToken: string; } }) | null;

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm([[
    { key: "email", helperText: "Enter a valid email.", validation: emailValidation },
    { key: "password" }
  ]]);

  const handleRememberChange = (checked: boolean) => {
    console.log("Remember me checkbox is checked: " + checked);
  }

  const onGoogleAuthLogin = () => {
    console.log("User requested to login with google");
  }

  const handleEmailEnterKeyPress = async () => {
    passwordInputRef?.current?.focus();
  }

  const handlePasswordEnterKeyPress = async () => {
    await form.handleSubmit(handleLogin);
  }

  const handleLogin = async ({ email, password }: FormValues) => {
    setError(null);

    const response = await fetchLogin(email, password);

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

    if (response.data === undefined) {
      setError("Something went wrong.");
      return;
    }

    setToken(response.data.accessToken);
    navigate("/dashboard");
  }

  const fetchLogin = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const body = {
        email, password
      }

      const response: AxiosResponse = await axios.post(`${API_ADDRESS}/users/login`, body);
      return response.data;
    } catch(err) { return null; }
  }

  return (
    <AuthLayout
      error={error}
      onErrorClose={() => setError(null)}
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

        <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
          <span>Forgot password?</span>
        </Link>
      </div>

      <SubmitButton
        text="Login"
        form={form}
        onPress={handleLogin}
      />
    </AuthLayout>
  )
}