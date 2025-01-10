import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import shared from "@purr/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    AUTH_SECRET: z.string().trim().min(1),
    AUTH_BASE_URL: z.string().trim().min(1),

    AUTH_DISCORD_ID: z.string().trim().min(1),
    AUTH_DISCORD_SECRET: z.string().trim().min(1),

    AUTH_GOOGLE_ID: z.string().trim().min(1),
    AUTH_GOOGLE_SECRET: z.string().trim().min(1),

    AUTH_APPLE_ID: z.string().trim().min(1),
    AUTH_APPLE_SECRET: z.string().trim().min(1),
  },

  client: {},

  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_BASE_URL: process.env.AUTH_BASE_URL,

    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,

    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,

    AUTH_APPLE_ID: process.env.AUTH_APPLE_ID,
    AUTH_APPLE_SECRET: process.env.AUTH_APPLE_SECRET,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
