import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {},

  server: {
    ARCJET_KEY: z.string().min(1),
  },

  client: {},

  runtimeEnv: {
    ARCJET_KEY: process.env.ARCJET_KEY,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
