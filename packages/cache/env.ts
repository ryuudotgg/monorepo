import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { env as shared } from "@ryuu/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    UPSTASH_REDIS_URL: z.string().url(),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().trim().min(1),
  },

  client: {},

  runtimeEnv: {
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
