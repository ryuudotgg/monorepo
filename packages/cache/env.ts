import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import shared from "@purr/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    KV_URL: z.string().url(),
    KV_REST_API_URL: z.string().url(),
    KV_REST_API_TOKEN: z.string().trim().min(1),
    KV_REST_API_READ_ONLY_TOKEN: z.string().trim().min(1),
  },

  client: {},

  runtimeEnv: {
    KV_URL: process.env.KV_URL,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
