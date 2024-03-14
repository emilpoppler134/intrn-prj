import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ADDRESS } from '../config';
import { ApiResponse, ResponseStatus, ErrorType } from '../types/ApiResponses';

import TextInput from '../components/TextInput';
import SubmitButton from '../components/SubmitButton';
import ErrorAlert from '../components/ErrorAlert';

type LoginResponse = (Omit<ApiResponse, 'data'> & {data?: { accessToken: string; } }) | null;

export default function Login() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitAvailable, setSubmitAvailable] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const nextFormData = {
      ...formData,
      [name]: value
    }

    setFormData(nextFormData);

    if (!Object.values(nextFormData).some(value => value.trim() === "")) {
      setSubmitAvailable(true);
    } else {
      setSubmitAvailable(false);
    }
  }  

  const onSubmit = async () => {
    setError(null);
    
    const email = formData.email;
    const password = formData.password;

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

    document.cookie = `accessToken=${response.data.accessToken};max-age=${1000 * 60 * 60 * 24 * 7};path=/;secure;`
    navigate("/dashboard");
  }

  const fetchLogin = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const options: RequestInit = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email, password
        })
      }

      const response: Response = await fetch(`${API_ADDRESS}/users/login`, options);
      return response.ok ? await response.json() : null;
    } catch(err) { return null; }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-16 w-auto"
            alt="Logo"
            src={`${API_ADDRESS}/images/logo.png`}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            
            <TextInput 
              name="email"
              key="email"
              type="text"
              title="Email"
              onChange={handleInputChange}
            />

            <TextInput
              name="password"
              key="password"
              type="password"
              title="Password"
              onChange={handleInputChange}
            />

            <div className="text-sm">
              <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
                <span className="font-semibold">Forgot password?</span>
              </Link>
            </div>

            <SubmitButton
              text="Login"
              available={submitAvailable}
              onSubmit={onSubmit}
            />

          </div>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <button className="w-full	px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
            <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
            <span>Login with Google</span>
          </button>
        </div>
      </div>

      {error === null ? null :
        <ErrorAlert message={error} onClose={() => setError(null)} />
      }
    </>
  )
}