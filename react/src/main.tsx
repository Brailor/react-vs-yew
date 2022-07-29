import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

const container = document.getElementById("root")!;
const root = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
// ReactDOM.createRoot(
// container
// ).render(
// root
// );
//

ReactDOM.hydrateRoot(container, root);
