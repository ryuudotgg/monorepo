import type { ServerRuntime } from "next";

import arcjet, {
  detectBot,
  fixedWindow,
  setRateLimitHeaders,
} from "@ryuu/security";

export const runtime: ServerRuntime = "nodejs";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:MONITOR"],
    }),
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "30s",
      max: 1,
    }),
  );

export async function GET(req: Request) {
  const decision = await aj.protect(req);

  if (decision.isDenied())
    if (decision.reason.isRateLimit()) {
      const res = new Response(
        JSON.stringify({
          code: "TOO_MANY_REQUESTS",
          message: "Too Many Requests",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );

      setRateLimitHeaders(res, decision);

      return res;
    } else
      return new Response(
        JSON.stringify({ code: "Forbidden", message: "Forbidden" }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );

  return new Response("OK", { status: 200 });
}
