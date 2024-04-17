import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";

import "./assets/index.css";
import "./assets/main.css";

const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
);
