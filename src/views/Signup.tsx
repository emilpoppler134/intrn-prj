import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ADDRESS } from '../config';
import { ApiResponse, ResponseStatus, ErrorType } from '../types/ApiResponses';

import TextInput from '../components/TextInput';
import SubmitButton from '../components/SubmitButton';
import AuthLayout from '../components/AuthLayout';

type SignupResponse = (Omit<ApiResponse, 'data'> & {data?: { accessToken: string; } }) | null;

export default function Signup() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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

  const onGoogleAuthSignup = () => {
    console.log("User requested to signup with google");
  }

  const onSubmit = async () => {
    setError(null);
    
    const name = formData.name;
    const email = formData.email;
    const password = formData.password;

    const response = await fetchSignup(name, email, password);

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
          setError("The email is already in use. Please try signing in, or use a different email.");
          return;
        }

        case ErrorType.HASH_PARSING: {
          setError("Couldn't hash the password you provided.");
          return;
        }

        case ErrorType.DATABASE_ERROR: {
          setError("Something went wrong when createing the user.");
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

  const fetchSignup = async (name: string, email: string, password: string): Promise<SignupResponse> => {
    try {
      const options: RequestInit = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name, email, password
        })
      }

      const response: Response = await fetch(`${API_ADDRESS}/users/signup`, options);
      return response.ok ? await response.json() : null;
    } catch(err) { return null; }
  }

  return (
    <AuthLayout
      error={error}
      footerLinkFor="signup"
      onErrorClose={() => setError(null)}
      onGoogleAuthClick={onGoogleAuthSignup}
      showGoogleAuth="Signup"
      title="Create a new account"
    >
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

      <TextInput
        name="password"
        key="password"
        type="password"
        title="Password"
        onChange={handleInputChange}
      />

      <SubmitButton
        text="Signup"
        available={submitAvailable}
        onSubmit={onSubmit}
      />
    </AuthLayout>
  )
}