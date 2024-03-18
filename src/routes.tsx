import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";

import Startpage from "./views/Startpage";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ForgotPassword from "./views/ForgotPassword";
import Dashboard from "./views/Dashboard";
import NotFound from "./views/NotFound";

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
        }
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