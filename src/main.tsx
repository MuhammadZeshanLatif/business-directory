import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import faviconUrl from "./images/fav.ico";

let faviconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");
if (!faviconLink) {
  faviconLink = document.createElement("link");
  faviconLink.rel = "icon";
  faviconLink.type = "image/x-icon";
  document.head.appendChild(faviconLink);
}
faviconLink.href = faviconUrl;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
