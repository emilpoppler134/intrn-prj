import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ADDRESS } from '../config';
import { ResponseStatus, ErrorType, ApiResponse } from '../types/ApiResponses';

import TextInput from '../components/TextInput';
import SubmitButton from '../components/SubmitButton';
import AuthLayout from '../components/AuthLayout';

type ForgotPasswordResponse = ApiResponse | null;

type CurrentFormDataType = { email: string } | { code: string } | { password: string, reenteredPassword: string }
type FormDataType = { email: string, code: string, password: string, reenteredPassword: string }

const descriptions: Array<string> = [
  "Please enter the email associated with your account. We'll send a verification code to reset your password.",
  "Check your email inbox for a verification code. Enter the code below to proceed with resetting your password.",
  "Enter a new password for your account."
]

type StepProps = {
  onRequestSubmit: () => void;
  onConfirmationSubmit: () => void;
  onResetSubmit: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  submitAvailable: boolean;
  step: number;
}

const Steps: React.FC<StepProps> = ({
  onRequestSubmit,
  onConfirmationSubmit,
  onResetSubmit,
  handleInputChange,
  submitAvailable,
  step
}) => {
  switch (step) {
    case 0: {
      return (
        <>
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
            title="Code"
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
            onSubmit={onResetSubmit}
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

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({ email: "", code: "", password: "", reenteredPassword: "" });
  const [currentFormData, setCurrentFormData] = useState<CurrentFormDataType>({ email: ""});
  const [submitAvailable, setSubmitAvailable] = useState(false);

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

  const onRequestSubmit = async () => {
    setError(null);
    
    const email = formData.email;

    const response = await fetchForgotPasswordRequest(email);

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

    setSubmitAvailable(false);
    setCurrentFormData({ code: "" });
    setStep(1);
  }

  const onConfirmationSubmit = async () => {
    setError(null);
    
    const email = formData.email;
    const code = formData.code;

    const response = await fetchForgotPasswordConfirmation(email, code);

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

    setSubmitAvailable(false);
    setCurrentFormData({ password: "", reenteredPassword: "" });
    setStep(2);
  }

  const onResetSubmit = async () => {
    setError(null);
    
    const email = formData.email;
    const code = formData.code;
    const password = formData.password;
    const reenteredPassword = formData.reenteredPassword;

    if (password !== reenteredPassword) {
      setError("Passwords doesn't match.");
      return;
    }

    const response = await fetchForgotPasswordSubmit(email, code, password);

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
  }

  const fetchForgotPasswordRequest = async (email: string): Promise<ForgotPasswordResponse> => {
    try {
      const options: RequestInit = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      }

      const response: Response = await fetch(`${API_ADDRESS}/users/forgot-password-request`, options);
      return response.ok ? await response.json() : null;
    } catch(err) { return null; }
  }

  const fetchForgotPasswordConfirmation = async (email: string, code: string): Promise<ForgotPasswordResponse> => {
    try {
      const options: RequestInit = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email, code
        })
      }

      const response: Response = await fetch(`${API_ADDRESS}/users/forgot-password-confirmation`, options);
      return response.ok ? await response.json() : null;
    } catch(err) { return null; }
  }

  const fetchForgotPasswordSubmit = async (email: string, code: string, password: string): Promise<ForgotPasswordResponse> => {
    try {
      const options: RequestInit = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email, code, password
        })
      }

      const response: Response = await fetch(`${API_ADDRESS}/users/forgot-password-submit`, options);
      return response.ok ? await response.json() : null;
    } catch(err) { return null; }
  }

  return (
    <AuthLayout
      error={error}
      description={descriptions[step]}
      footerLinkFor="forgot-password"
      onErrorClose={() => setError(null)}
      showGoogleAuth={false}
      title="Forgot password"
    >
      <Steps
        onRequestSubmit={onRequestSubmit}
        onConfirmationSubmit={onConfirmationSubmit}
        onResetSubmit={onResetSubmit}
        handleInputChange={handleInputChange}
        submitAvailable={submitAvailable}
        step={step}
      />
    </AuthLayout>
  )
}