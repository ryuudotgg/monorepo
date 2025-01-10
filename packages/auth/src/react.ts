import {
  inferAdditionalFields,
  magicLinkClient,
  passkeyClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { defaultAuth } from ".";

const authClient = createAuthClient({
  plugins: [
    passkeyClient(),
    magicLinkClient(),
    inferAdditionalFields<typeof defaultAuth>(),
  ],
});

type Session = typeof authClient.$Infer.Session;

export { authClient };
export type { Session };
