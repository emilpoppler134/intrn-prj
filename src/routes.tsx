import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { ProtectedSubscriptionRoute } from "./components/routes/ProtectedSubscriptionRoute";

import BotChat from "./views/BotChat";
import BotConfig from "./views/BotConfig";
import Dashboard from "./views/Dashboard";
import ForgotPassword from "./views/ForgotPassword";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Payment from "./views/Payment";
import PaymentResult from "./views/PaymentResult";
import Settings from "./views/Settings";
import Signup from "./views/Signup";
import Startpage from "./views/Startpage";
import Subscriptions from "./views/Subscriptions";

const Routes = () => {
  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: <Startpage />,
      errorElement: <NotFound />,
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
          path: "/subscriptions",
          element: <Subscriptions />,
        },
        {
          path: "/subscriptions/payment/",
          element: <Payment />,
        },
        {
          path: "/subscriptions/payment/result",
          element: <PaymentResult />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/",
          element: <ProtectedSubscriptionRoute />,
          children: [
            {
              path: "/bots/:bot",
              element: <BotChat />,
            },
            {
              path: "/bots/:bot/:chat",
              element: <BotChat />,
            },
            {
              path: "/bots/:id/config",
              element: <BotConfig />,
            },
          ],
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
