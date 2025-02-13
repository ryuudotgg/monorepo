import "server-only";

import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient();
