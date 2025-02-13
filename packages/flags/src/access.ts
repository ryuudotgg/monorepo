import type { NextRequest } from "next/server";
import { verifyAccess } from "@vercel/flags";

import * as flags from ".";

export async function GET(request: NextRequest): Promise<Response> {
  const access = await verifyAccess(request.headers.get("Authorization"));
  if (!access)
    return new Response(
      JSON.stringify({ code: "UNAUTHORIZED", message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );

  const definitions = Object.fromEntries(
    Object.entries(flags).map(([key, flag]) => [
      key,
      {
        origin: flag.origin,
        description: flag.description,
        options: flag.options,
      },
    ]),
  );

  return new Response(JSON.stringify({ definitions }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
