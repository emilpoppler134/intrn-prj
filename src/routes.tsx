import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";

import Startpage from "./views/Startpage";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ForgotPassword from "./views/ForgotPassword";
import Dashboard from "./views/Dashboard";
import NotFound from "./views/NotFound";
import BotChat from "./views/BotChat";
import BotConfig from "./views/BotConfig";
import Settings from "./views/Settings";

const Routes = () => {
  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: <Startpage />,
      errorElement: <NotFound />
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
  ];

  // Define routes accessible only to authenticated users
  const authenticatedRoutes = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/bots/:id",
          element: <BotChat />,
        },
        {
          path: "/bots/:id/config",
          element: <BotConfig />,
        },
      ],
    },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...authenticatedRoutes,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;