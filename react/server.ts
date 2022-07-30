import path from "node:path";
import fs from "node:fs";
// import assert from "node:assert";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import fastifyExpress from "@fastify/express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (pathToResolve: string) =>
  path.resolve(__dirname, pathToResolve);

type ServerConfig = {
  root: string;
  hmrPort: number;
  logging: boolean;
  isProd: boolean;
};

export const createServer = async (
  args?: Partial<ServerConfig>,
) => {
  const {
    root = process.cwd(),
    hmrPort = 3000,
    logging = false,
    isProd = process.env.NODE_ENV === "PRODUCTION",
  } = args || {};
  const app = Fastify({
    logger: logging,
  });

  await app.register(fastifyExpress);
  console.log({ root });

  const vite = await (
    await import("vite")
  ).createServer({
    root,
    logLevel: "error",
    server: {
      middlewareMode: "ssr",
      hmr: {
        port: hmrPort,
      },
    },
    appType: "custom",
  });
  // use vite's connect instance as middleware
  app.use(vite.middlewares);

  let template = isProd
    ? fs.readFileSync(resolve("../index.html"), "utf8")
    : "";

  const render = (await vite.ssrLoadModule(resolve("../src/server-entry.tsx")))
    .render;
  app.get("*", async (request, reply) => {
    try {
      const url = request.url;
      console.log(url);

      if (!isProd) {
        let shouldSSR = true;
        const query = request.query as Record<string, any> | null;
        if (query && "ssr" in query) {
          shouldSSR = query.ssr === "true";
        }

        template = fs.readFileSync(resolve("../index.html"), "utf8");
        template = await vite.transformIndexHtml(url, template);

        if (!shouldSSR) {
          reply.type("text/html").send(template);
          return;
        }
      } else {
        template = await vite.transformIndexHtml(url, template);
      }
      template = template.replace("<!-- app--root -->", render(url));
      reply.type("text/html").send(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);

      reply.code(500).send((e as Error).message);
    }
  });

  return app;
};
const port = 3000;

createServer({ logging: false, hmrPort: 3001 }).then((app) => {
  app.listen({ port }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`server listening on ${address}`);
    console.log("server started");
  });
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
