import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";

import { authConfig } from "./config";

const defaultAuth = betterAuth(authConfig);
const handlers = toNextJsHandler(defaultAuth.handler);

type Session = typeof defaultAuth.$Infer.Session;
const auth = defaultAuth.api;

export { auth, defaultAuth, handlers };
export type { Session };

export { isSecureContext, validateToken } from "./config";
