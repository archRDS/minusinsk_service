import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4174);
const files = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/styles.css": ["styles.css", "text/css; charset=utf-8"],
  "/theme.css": ["theme.css", "text/css; charset=utf-8"],
  "/config.js": ["config.js", "text/javascript; charset=utf-8"],
  "/app.js": ["app.js", "text/javascript; charset=utf-8"],
  "/favicon.svg": ["favicon.svg", "image/svg+xml"],
  "/hero-photo.png": ["hero-photo.png", "image/png"]
};

createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const file = files[pathname];
  if (!file) { response.writeHead(404); response.end("Not found"); return; }
  try {
    const body = await readFile(join(root, file[0]));
    response.writeHead(200, { "Content-Type": file[1], "Cache-Control": "no-store" });
    response.end(body);
  } catch {
    response.writeHead(500); response.end("Server error");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Сайт открыт: http://localhost:${port}`);
  console.log("Остановить сервер: Ctrl+C");
});
