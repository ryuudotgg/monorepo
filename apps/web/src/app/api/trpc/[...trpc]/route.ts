import type { ServerRuntime } from "next";
import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { geolocation, ipAddress } from "@vercel/functions";

import { auth } from "@ryuu/auth";
import { processError } from "@ryuu/observability/error";
import { appRouter, createTRPCContext } from "@ryuu/trpc";

export const runtime: ServerRuntime = "edge";

function setCorsHeaders(req: Request, res: Response) {
  const origin = req.headers.get("origin");
  if (!origin) return new Response(null, { status: 400 });

  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Headers", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");

  res.headers.set("Access-Control-Max-Age", "7200");

  return res;
}

function OPTIONS(req: NextRequest) {
  const res = new Response(null, { status: 204 });
  return setCorsHeaders(req, res);
}

const handler = async (req: Request) => {
  const { user } = (await auth.getSession({ headers: req.headers })) ?? {};

  const res = await fetchRequestHandler({
    req,

    endpoint: "/api/trpc",
    router: appRouter,

    createContext: () => createTRPCContext({ headers: req.headers }),

    onError: ({ path, error }) => {
      const ip = ipAddress(req);
      const geo = geolocation(req);

      processError(error, { user, ip, geo }, { path });
    },
  });

  return setCorsHeaders(req, res);
};

export { handler as GET, OPTIONS, handler as POST };
