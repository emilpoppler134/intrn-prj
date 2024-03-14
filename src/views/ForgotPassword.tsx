import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ADDRESS } from '../config';
import { ResponseStatus, ErrorType, ApiResponse } from '../types/ApiResponses';

import TextInput from '../components/TextInput';
import SubmitButton from '../components/SubmitButton';
import ErrorAlert from '../components/ErrorAlert';

type ForgotPasswordResponse = ApiResponse | null;

type StepProps = {
  onRequestSubmit: () => void;
  onConfirmationSubmit: () => void;
  onResetSubmit: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  submitAvailable: boolean;
  step: number;
}

type CurrentFormDataType = { email: string } | { code: string } | { password: string }
type FormDataType = { email: string, code: string, password: string }

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
          <span className="text-base font-medium text-gray-700">Please enter the email associated with your account. We'll send a verification code to reset your password.</span>

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
          <span className="text-base font-medium text-gray-700">Check your email inbox for a verification code. Enter the code below to proceed with resetting your password.</span>

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
          <span className="text-base font-medium text-gray-700">Enter a new password for your account.</span>

          <TextInput
            name="password"
            key="password"
            type="password"
            title="New password"
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
  const [formData, setFormData] = useState<FormDataType>({ email: "", code: "", password: "" });
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
          setError("Something went wrong when createing the reset code.");
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
    setCurrentFormData({ password: "" });
    setStep(2);
  }

  const onResetSubmit = async () => {
    setError(null);
    
    const email = formData.email;
    const code = formData.code;
    const password = formData.password;

    const response = await fetchForgotPasswordReset(email, code, password);

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
          setError("The email or reset code are incorrect.");
          return;
        }

        case ErrorType.DATABASE_ERROR: {
          setError("Something went wrong when updating the password.");
          return;
        }

        case ErrorType.HASH_PARSING: {
          setError("Couldn't hash the password you provided.");
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

  const fetchForgotPasswordReset = async (email: string, code: string, password: string): Promise<ForgotPasswordResponse> => {
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

      const response: Response = await fetch(`${API_ADDRESS}/users/forgot-password-reset`, options);
      return response.ok ? await response.json() : null;
    } catch(err) { return null; }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-sm">
            <Link to="/login" className="flex font-semibold text-gray-900 hover:text-gray-800">
              <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
              </svg>
              <span>Back to login</span>
            </Link>
          </div>

          <img
            className="mx-auto h-16 w-auto"
            alt="Logo"
            src={`${API_ADDRESS}/images/logo.png`}
          />

          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            <span>Reset password</span>
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <Steps
              onRequestSubmit={onRequestSubmit}
              onConfirmationSubmit={onConfirmationSubmit}
              onResetSubmit={onResetSubmit}
              handleInputChange={handleInputChange}
              submitAvailable={submitAvailable}
              step={step}
            />
          </div>
        </div>
      </div>

      {error === null ? null :
        <ErrorAlert message={error} onClose={() => setError(null)} />
      }
    </>
  )
}