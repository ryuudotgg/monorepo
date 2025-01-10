import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import shared from "@purr/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    DATABASE_URL: z.string().url(),
  },

  client: {},

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
