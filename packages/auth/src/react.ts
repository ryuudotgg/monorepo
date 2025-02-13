import {
  inferAdditionalFields,
  magicLinkClient,
  passkeyClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { defaultAuth } from ".";

export const authClient = createAuthClient({
  plugins: [
    passkeyClient(),
    magicLinkClient(),
    inferAdditionalFields<typeof defaultAuth>(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
