import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { PackAndInvContextProvider  } from "./context/PackAndInvContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PackAndInvContextProvider>
      <App />
    </PackAndInvContextProvider>
  </React.StrictMode>
);

reportWebVitals();
