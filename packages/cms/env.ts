import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import shared from "@ryuu/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    BASEHUB_TOKEN: z.string().trim().min(1),
  },

  client: {},

  runtimeEnv: {
    BASEHUB_TOKEN: process.env.BASEHUB_TOKEN,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
