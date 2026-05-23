import { createRoot } from "react-dom/client";
import "virtual:pwa-register";
import App from "./App";
import "./index.css";

document.documentElement.classList.add("app-ready");

createRoot(document.getElementById("root")!).render(<App />);
