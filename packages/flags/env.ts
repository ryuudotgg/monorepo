import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { env as shared } from "@ryuu/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    STATSIG_PROJECT_ID: z.string().optional(),

    STATSIG_API_KEY: z.string(),
    STATSIG_CONSOLE_KEY: z.string(),

    STATSIG_EDGE_CONFIG: z.string().url(),
    STATSIG_EDGE_CONFIG_KEY: z.string(),
  },

  client: {
    NEXT_PUBLIC_STATSIG_CLIENT_KEY: z.string(),
  },

  runtimeEnv: {
    STATSIG_PROJECT_ID: process.env.STATSIG_PROJECT_ID,

    STATSIG_API_KEY: process.env.STATSIG_API_KEY,
    STATSIG_CONSOLE_KEY: process.env.STATSIG_CONSOLE_KEY,

    STATSIG_EDGE_CONFIG: process.env.STATSIG_EDGE_CONFIG,
    STATSIG_EDGE_CONFIG_KEY: process.env.STATSIG_EDGE_CONFIG_KEY,

    NEXT_PUBLIC_STATSIG_CLIENT_KEY: process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
