import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from '../provider/authProvider';

export const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (token === null) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  return token ? <Outlet /> : null;
}
