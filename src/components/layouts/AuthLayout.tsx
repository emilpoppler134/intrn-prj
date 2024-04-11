import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { API_ADDRESS } from "../../config";
import { ExtendedError } from "../../utils/ExtendedError";
import ErrorAlert from "../ErrorAlert";

type Page = "login" | "signup" | "forgot-password";

type FooterLinkProps = {
  page: Page;
};

const FooterLink: React.FC<FooterLinkProps> = ({ page }) => {
  switch (page) {
    case "login": {
      return (
        <p className="mt-6 text-center text-sm font-light text-gray-500 dark:text-gray-400">
          <span className="pr-1">Don't have an account yet?</span>
          <Link
            to="/signup"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Signup
          </Link>
        </p>
      );
    }

    case "signup": {
      return (
        <p className="mt-6 text-center text-sm font-light text-gray-500 dark:text-gray-400">
          <span className="pr-1">Already have an account?</span>
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Login
          </Link>
        </p>
      );
    }

    case "forgot-password": {
      return (
        <p className="mt-6 text-center text-sm font-light text-gray-500 dark:text-gray-400">
          <span className="pr-1">Go back to</span>
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Login
          </Link>
        </p>
      );
    }

    default: {
      return null;
    }
  }
};

type Props = {
  children: ReactNode;
  description?: string;
  error: Error | null;
  onErrorClose: () => void;
  onGoogleAuthClick?: () => void;
  page: Page;
  showGoogleAuth: boolean;
  title: string;
};

const AuthLayout: React.FC<Props> = ({
  children,
  description,
  error,
  onErrorClose,
  onGoogleAuthClick,
  page,
  showGoogleAuth,
  title,
}) => {
  const handleGoogleAuthClick = () => {
    if (onGoogleAuthClick === undefined) return;
    onGoogleAuthClick();
  };

  const handleErrorClose = () => {
    onErrorClose?.();
  };

  const extendedError =
    error instanceof ExtendedError
      ? error
      : error && new ExtendedError(error.message);

  return (
    <div className="bg-gray-50 h-full">
      <div className="flex justify-center items-center h-full">
        <div className="w-full bg-white rounded-lg shadow p-6 lg:px-8 dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-start sm:mx-auto sm:w-full sm:max-w-sm">
            <Link to="/">
              <img
                className="h-16 w-auto"
                alt="Logo"
                src={`${API_ADDRESS}/images/logo.png`}
              />
            </Link>

            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              <span>{title}</span>
            </h2>

            {description === undefined ? null : (
              <span className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </span>
            )}
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-6">{children}</div>
          </div>

          {!showGoogleAuth ? null : (
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
              <button
                onClick={handleGoogleAuthClick}
                className="w-full	px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
              >
                <img
                  className="w-6 h-6"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  loading="lazy"
                  alt="google logo"
                />
                <span>
                  <span className="capitalize">{page}</span> with Google
                </span>
              </button>
            </div>
          )}

          <FooterLink page={page} />
        </div>
      </div>

      {!extendedError ? null : extendedError.closeable ? (
        <ErrorAlert
          message={extendedError.message}
          onClose={handleErrorClose}
        />
      ) : (
        <ErrorAlert message={extendedError.message} />
      )}
    </div>
  );
};

export default AuthLayout;
