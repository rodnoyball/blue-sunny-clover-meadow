import shell from "../../src/game/shell.html?raw";

interface ShellEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

export default function gameShellMiddleware(
  event: ShellEvent,
  next: () => unknown | Promise<unknown>,
): unknown {
  const method = (event.req.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") return next();
  if (event.url.pathname !== "/") return next();
  if (event.url.searchParams.has("install")) return next();
  const accept = event.req.headers.get("accept") ?? "";
  if (accept && !accept.includes("text/html") && !accept.includes("*/*")) return next();
  return new Response(method === "HEAD" ? null : shell, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-cache",
    },
  });
}
