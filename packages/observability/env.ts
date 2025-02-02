import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { env as shared } from "@ryuu/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    BETTERSTACK_UPTIME_API_KEY: z.string().trim().min(1),

    SENTRY_ORG: z.string().trim().min(1),
    SENTRY_PROJECT: z.string().trim().min(1),
  },

  client: {
    NEXT_PUBLIC_SENTRY_DSN: z.string().url(),
  },

  runtimeEnv: {
    BETTERSTACK_UPTIME_API_KEY: process.env.BETTERSTACK_UPTIME_API_KEY,

    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
