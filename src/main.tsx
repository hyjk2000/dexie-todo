import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
document.documentElement.classList.toggle("dark", systemTheme.matches);
systemTheme.addEventListener("change", (event) => {
  document.documentElement.classList.toggle("dark", event.matches);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
