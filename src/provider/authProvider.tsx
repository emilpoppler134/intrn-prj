import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from 'axios';

import { ResponseStatus, ValidDataResponse } from "../types/ApiResponses";
import { User } from '../types/User';
import { callAPI } from "../utils/apiService";

type AuthContextProps = {
  token: string | null;
  user: User | null | undefined;
  setToken: (newToken: string | null) => void;
  signNewToken: () => Promise<void>;
} | null;

type AuthProviderProps = {
  children: ReactElement;
}

const AuthContext = createContext<AuthContextProps>(null);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, _setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token', token);

      callAPI<User>("/users/validate-token")
        .then(response => {
          if (response === null || response.status === ResponseStatus.ERROR) {
            setUser(null);
            return;
          }

          const validDataResponse = response as ValidDataResponse & { data: User };

          setUser(validDataResponse.data);
        });
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const setToken = (newToken: string | null) => {
    _setToken(newToken);
    setUser(undefined);
  }

  const signNewToken = useCallback(async () => {
    const response = await callAPI<{ token: string; }>("/users/sign-new-token");

    if (response === null || response.status === ResponseStatus.ERROR) {
      setUser(null);
      return;
    }

    const validDataResponse = response as ValidDataResponse & { data: { token: string; } };

    setToken(validDataResponse.data.token);
  }, []);

  const contextValue = useMemo(
    () => ({
      token,
      user,
      setToken,
      signNewToken
    }),
    [token, user, signNewToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("Something went wrong...");
  }

  return context;
};

export default AuthProvider;