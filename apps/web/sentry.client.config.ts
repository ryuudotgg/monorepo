import { init } from "@sentry/nextjs";

import { env } from "@ryuu/observability/env";

init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
});
