import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";

import { authConfig } from "./config";

const defaultAuth = betterAuth(authConfig);

export const auth = defaultAuth.api;
export const handlers = toNextJsHandler(defaultAuth.handler);

export type Session = typeof defaultAuth.$Infer.Session;

export { isSecureContext, validateToken } from "./config";
export type { defaultAuth };
