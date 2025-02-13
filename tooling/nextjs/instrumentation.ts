import { init } from "@sentry/nextjs";

import { env } from "@ryuu/observability/env";

const opts = { dsn: env.NEXT_PUBLIC_SENTRY_DSN };

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") init(opts);
  if (process.env.NEXT_RUNTIME === "edge") init(opts);
}
