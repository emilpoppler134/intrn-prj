import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

import { API_ADDRESS } from '../config';
import { ApiResponse, ResponseStatus, ErrorType } from '../types/ApiResponses';

import TextInput from '../components/TextInput';
import SubmitButton from '../components/SubmitButton';
import AuthLayout from '../components/AuthLayout';

import type { ShowGoogleAuthType } from '../components/AuthLayout';

type SignupStatusResponse = ApiResponse | null;
type SignupResponse = (Omit<ApiResponse, 'data'> & {data?: { accessToken: string; } }) | null;

type CurrentFormDataType = { name: string, email: string } | { code: string } | { password: string, reenteredPassword: string }
type FormDataType = { name: string, email: string, code: string, password: string, reenteredPassword: string }

const descriptions: Array<string> = [
  "Please enter your full name and your email. We'll send a verification code to your email.",
  "Check your email inbox for a verification code. Enter the code below to proceed with creating your account.",
  "Enter a new password for your account."
]

type StepProps = {
  onRequestSubmit: () => void;
  onConfirmationSubmit: () => void;
  onSignupSubmit: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  submitAvailable: boolean;
  step: number;
}

const Steps: React.FC<StepProps> = ({
  onRequestSubmit,
  onConfirmationSubmit,
  onSignupSubmit,
  handleInputChange,
  submitAvailable,
  step
}) => {
  switch (step) {
    case 0: {
      return (
        <>
          <TextInput 
            name="name"
            key="name"
            type="text"
            title="Name"
            onChange={handleInputChange}
          />

          <TextInput 
            name="email"
            key="email"
            type="text"
            title="Email"
            onChange={handleInputChange}
          />

          <SubmitButton
            text="Next"
            available={submitAvailable}
            onSubmit={onRequestSubmit}
          />
        </>
      )
    }

    case 1: {
      return (
        <>
          <TextInput
            name="code"
            key="code"
            type="text"
            title="Verification code"
            onChange={handleInputChange}
          />

          <SubmitButton
            text="Next"
            available={submitAvailable}
            onSubmit={onConfirmationSubmit}
          />
        </>
      )
    }

    case 2: {
      return (
        <>
          <TextInput
            name="password"
            key="password"
            type="password"
            title="New password"
            onChange={handleInputChange}
          />

          <TextInput
            name="reenteredPassword"
            key="reenteredPassword"
            type="password"
            title="Re-enter new password"
            onChange={handleInputChange}
          />

          <SubmitButton
            text="Save"
            available={submitAvailable}
            onSubmit={onSignupSubmit}
          />
        </>
      )
    }
    
    default: {
      return (
        <>
          <span className="text-base font-medium text-gray-700">Something went wrong.</span>
        </>
      )
    }
  }
}

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({ name: "", email: "", code: "", password: "", reenteredPassword: "" });
  const [currentFormData, setCurrentFormData] = useState<CurrentFormDataType>({ name: "", email: "" });
  const [submitAvailable, setSubmitAvailable] = useState(false);
  const [showGoogleSignup, setShowGoogleSignup] = useState<ShowGoogleAuthType>("signup");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const nextFormData = {
      ...formData,
      [name]: value
    }
    setFormData(nextFormData);

    const nextCurrentFormData = {
      ...currentFormData,
      [name]: value
    }
    setCurrentFormData(nextCurrentFormData);

    if (!Object.values(nextCurrentFormData).some(value => value.trim() === "")) {
      setSubmitAvailable(true);
    } else {
      setSubmitAvailable(false);
    }
  }

  const onGoogleAuthSignup = () => {
    console.log("User requested to signup with google");
  }

  const onRequestSubmit = async () => {
    setError(null);

    const name = formData.name;
    const email = formData.email;

    const response = await fetchSignupRequest(name, email);

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

        case ErrorType.USER_EXISTS: {
          setError("That email is already in use. Please try signing in, or use a different email.");
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

    setShowGoogleSignup(false);
    setSubmitAvailable(false);
    setCurrentFormData({ code: "" });
    setStep(1);
  }

  const onConfirmationSubmit = async () => {
    setError(null);
    
    const email = formData.email;
    const code = formData.code;

    const response = await fetchSignupConfirmation(email, code);

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

    setSubmitAvailable(false);
    setCurrentFormData({ password: "", reenteredPassword: "" });
    setStep(2);
  }

  const onSignupSubmit = async () => {
    setError(null);
    
    const name = formData.name;
    const email = formData.email;
    const code = formData.code;
    const password = formData.password;
    const reenteredPassword = formData.reenteredPassword;

    if (password !== reenteredPassword) {
      setError("Passwords doesn't match.");
      return;
    }

    const response = await fetchSignupSubmit(name, email, code, password);

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

        case ErrorType.USER_EXISTS: {
          setError("That email is already in use. Please try signing in, or use a different email.");
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

    if (response.data === undefined) {
      setError("Something went wrong.");
      return;
    }

    document.cookie = `accessToken=${response.data.accessToken};max-age=${1000 * 60 * 60 * 24 * 7};path=/;secure;`
    navigate("/dashboard");
  }

  const fetchSignupRequest = async (name: string, email: string): Promise<SignupStatusResponse> => {
    try {
      const body = {
        name, email
      }

      const response: AxiosResponse = await axios.post(`${API_ADDRESS}/users/signup-request`, body);
      return response.data;
    } catch(err) { return null; }
  }

  const fetchSignupConfirmation = async (email: string, code: string): Promise<SignupStatusResponse> => {
    try {
      const body = {
        email, code
      }

      const response: AxiosResponse = await axios.post(`${API_ADDRESS}/users/signup-confirmation`, body);
      return response.data;
    } catch(err) { return null; }
  }

  const fetchSignupSubmit = async (name: string, email: string, code: string, password: string): Promise<SignupResponse> => {
    try {
      const body = {
        name, email, code, password
      }

      const response: AxiosResponse = await axios.post(`${API_ADDRESS}/users/signup-submit`, body);
      return response.data;
    } catch(err) { return null; }
  }

  return (
    <AuthLayout
      error={error}
      description={descriptions[step]}
      footerLinkFor="signup"
      onErrorClose={() => setError(null)}
      onGoogleAuthClick={onGoogleAuthSignup}
      showGoogleAuth={showGoogleSignup}
      title="Create a new account"
    >
      <Steps
        onRequestSubmit={onRequestSubmit}
        onConfirmationSubmit={onConfirmationSubmit}
        onSignupSubmit={onSignupSubmit}
        handleInputChange={handleInputChange}
        submitAvailable={submitAvailable}
        step={step}
      />
    </AuthLayout>
  )
}