import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.scss";
import "boxicons/css/boxicons.min.css";
import "boxicons";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
