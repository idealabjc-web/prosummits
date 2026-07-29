import { StrictMode } from "react";
import { createRoot }  from "react-dom/client";
import App             from "./App";

// Auto-recover from stale deployment script/module loading errors
window.addEventListener("error", (event) => {
  const isModuleScriptError =
    event?.message?.includes("Failed to load module script") ||
    event?.message?.includes("dynamically imported module") ||
    event?.message?.includes("MIME type of \"text/html\"");
  if (isModuleScriptError) {
    const hasReloaded = sessionStorage.getItem("prosummits_stale_reload");
    if (!hasReloaded) {
      sessionStorage.setItem("prosummits_stale_reload", "true");
      window.location.reload();
    }
  }
});

// Clear stale reload flag after successful page mount
sessionStorage.removeItem("prosummits_stale_reload");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);