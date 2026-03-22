import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to not-found.html with 404 status if the file doesn't exist
  app.use("*", (_req, res) => {
    res.status(404).sendFile(path.resolve(distPath, "not-found.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
