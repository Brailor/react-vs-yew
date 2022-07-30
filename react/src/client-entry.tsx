import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

const root = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
const container = document.getElementById("root")!;

const initApp = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const clientOnlyRender = urlSearchParams.get("ssr") === "false";

  if (!clientOnlyRender) {
    console.log("Hydrating...");
    ReactDOM.hydrateRoot(container, root);
  } else {
    console.log("NOT Hydrating...");
    ReactDOM.createRoot(
      container,
    ).render(
      root,
    );
  }
};

initApp();
