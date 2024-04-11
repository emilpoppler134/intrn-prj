import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";

export const ProtectedSubscriptionRoute: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (user.subscription.status === null) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return user && user.subscription.status ? <Outlet /> : null;
};
