import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { env as analytics } from "@ryuu/analytics/env";
import { env as shared } from "@ryuu/env";
import { env as flags } from "@ryuu/flags/env";

export const env = createEnv({
  extends: [shared, analytics, flags],

  shared: {},

  server: {
    PORT: z.coerce.number().default(3000).optional(),
  },

  client: {},

  runtimeEnv: {
    PORT: process.env.PORT,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
