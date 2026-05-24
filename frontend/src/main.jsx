import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css";

window.addEventListener("unhandledrejection", (event) => {
  console.error("UNHANDLED PROMISE:", event.reason);
});

window.addEventListener("error", (event) => {
  console.error("GLOBAL ERROR:", event.error);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
