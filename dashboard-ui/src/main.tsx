import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";


// ⬇️ اگر Context داری (مثلاً Settings / Auth)
// import { SettingsProvider } from "./context/SettingsContext";
// import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  
  <BrowserRouter>
    {/* اگر Provider داری اینجا اضافه میشه */}
    {/* <AuthProvider> */}
    {/* <SettingsProvider> */}
        <App />
    {/* </SettingsProvider> */}
    {/* </AuthProvider> */}
  </BrowserRouter>
);
