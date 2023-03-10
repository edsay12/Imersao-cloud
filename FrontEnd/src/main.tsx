import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/globalStyle.sass";
import "react-toastify/dist/ReactToastify.css"; // O estilo do Toastify


import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
} from "react-router-dom";
import CardModalContext from "./context/cardModalContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
