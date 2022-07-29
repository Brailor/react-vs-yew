import ReactDomServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { App } from "./App";

export const render = (url: string) => {
  return ReactDomServer.renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
};
