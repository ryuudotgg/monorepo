import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { env as shared } from "@ryuu/env";

export const env = createEnv({
  extends: [shared],

  shared: {},

  server: {
    BLOB_READ_WRITE_TOKEN: z.string().trim().min(1),
  },

  client: {
    NEXT_PUBLIC_BLOB_URL: z.string().url(),
  },

  runtimeEnv: {
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    NEXT_PUBLIC_BLOB_URL: process.env.NEXT_PUBLIC_BLOB_URL,
  },

  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
