import { createBrowserRouter } from "react-router-dom";

import Dashboard from './views/Dashboard';
import Login from './views/Login';
import ForgotPassword from "./views/ForgotPassword";

const router = createBrowserRouter([
  { path: "/", element: Dashboard() },
  { path: "/login", element: Login() },
  { path: "/forgot-password", element: ForgotPassword() }
]);

export default router;