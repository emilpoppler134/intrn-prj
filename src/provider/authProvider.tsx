import { ReactElement, createContext, useContext, useEffect, useMemo, useState } from "react";
import axios, { AxiosResponse } from 'axios';

import { API_ADDRESS } from "../config";
import { ApiResponse, ResponseStatus } from "../types/ApiResponses";
import { User } from '../types/User';

type AuthContextProps = {
  token: string | null;
  user: User | null | undefined;
  setToken: (newToken: string | null) => void;
} | null;

type AuthProviderProps = {
  children: ReactElement;
}

type FindUserResponse = (Omit<ApiResponse, 'data'> & { data?: User }) | null;

const AuthContext = createContext<AuthContextProps>(null);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, _setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const setToken = (newToken: string | null) => {
    _setToken(newToken);
    setUser(undefined);
  }

  useEffect(() => {
    const fetchFindUser = async (): Promise<FindUserResponse> => {
      try {
        const body = {
          mode: "AccessToken",
          accessToken: token
        }

        const response: AxiosResponse = await axios.post(`${API_ADDRESS}/users/find`, body);
        
        return response.data;
      } catch(err) { return null; }
    }

    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token', token);

      fetchFindUser()
        .then(response => {
          if (response === null || response.status === ResponseStatus.ERROR || response.data === undefined) {
            setUser(null);
            return;
          }

          setUser(response.data);
        });
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      user,
      setToken,
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("oj");
  }

  return context;
};

export default AuthProvider;