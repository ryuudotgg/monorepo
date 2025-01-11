import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import shared from "@ryuu/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    EDGE_CONFIG: z.string().url(),
    LAUNCHDARKLY_CLIENT_ID: z.string(),
  },

  client: {},

  runtimeEnv: {
    EDGE_CONFIG: process.env.EDGE_CONFIG,
    LAUNCHDARKLY_CLIENT_ID: process.env.LAUNCHDARKLY_CLIENT_ID,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
