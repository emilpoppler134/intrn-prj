import React from "react";
import ReactDOM from "react-dom/client";
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";

import "./assets/index.css";
import "./assets/main.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </React.StrictMode>,
);
