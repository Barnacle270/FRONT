import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/ui.css";
import CustomToaster from "./components/CustomToaster.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <CustomToaster /> {/* 👈 Aquí montas tu toast global */}
  </React.StrictMode>
);
