// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import { ProgressProvider } from "./context/ProgressContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </React.StrictMode>
);
