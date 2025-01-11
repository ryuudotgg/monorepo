import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import shared from "@ryuu/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    RESEND_KEY: z.string().trim().min(1),
    RESEND_FROM: z.string().trim().min(1),
  },

  client: {},

  runtimeEnv: {
    RESEND_KEY: process.env.RESEND_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
