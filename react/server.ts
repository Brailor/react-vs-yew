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
};

export const createServer = async (
  args?: Partial<ServerConfig>,
) => {
  const { root = process.cwd(), hmrPort = 3000, logging = false } = args || {};
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

  const indexFile = fs.readFileSync(resolve("../index.html"), "utf8");
  let template = indexFile;

  app.get("*", async (request, reply) => {
    try {
      const url = request.url;
      template = await vite.transformIndexHtml(url, template);
      const render =
        (await vite.ssrLoadModule(resolve("../src/server-render.tsx")))
          .render;

      template = template.replace("<!-- app--root -->", render(url));

      reply.type("text/html").send(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
    }
  });

  return app;
};
const port = 3000;

createServer({ logging: true, hmrPort: 3001 }).then((app) => {
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
