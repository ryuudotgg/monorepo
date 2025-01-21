import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import shared from "@ryuu/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    BLOB_READ_WRITE_TOKEN: z.string().trim().min(1),
  },

  client: {},

  runtimeEnv: {
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
