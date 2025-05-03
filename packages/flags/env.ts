import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { env as shared } from "@ryuu/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    STATSIG_API_KEY: z.string(),
    STATSIG_PROJECT_ID: z.string().optional(),

    STATSIG_EDGE_CONFIG: z.string().url(),
    STATSIG_EDGE_CONFIG_KEY: z.string(),
  },

  client: {},

  runtimeEnv: {
    STATSIG_API_KEY: process.env.STATSIG_API_KEY,
    STATSIG_PROJECT_ID: process.env.STATSIG_PROJECT_ID,

    STATSIG_EDGE_CONFIG: process.env.STATSIG_EDGE_CONFIG,
    STATSIG_EDGE_CONFIG_KEY: process.env.STATSIG_EDGE_CONFIG_KEY,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
