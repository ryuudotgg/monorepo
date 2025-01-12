import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import type { users } from "@ryuu/db/schema";
import { auth, validateToken } from "@ryuu/auth";
import { db } from "@ryuu/db/client";
import { log } from "@ryuu/observability/log";

/**
 * Session resolver for API requests
 *
 * Handles both:
 * - Expo: Authorization Header Token
 * - Next.js: Cookie-based Sessions
 */
const isomorphicGetSession = async (headers: Headers) => {
  const authToken = headers.get("Authorization") ?? null;
  if (authToken) return validateToken(authToken);

  return auth.getSession({ headers });
};

/**
 * tRPC Context Creator
 *
 * Provides access to essential backend resources:
 * - Database Connection
 * - Authentication Details
 * - User Session
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const authToken = opts.headers.get("Authorization") ?? null;
  const { session, user } = (await isomorphicGetSession(opts.headers)) ?? {};

  const source = opts.headers.get("x-trpc-source") ?? "unknown";
  log.info(`TRPC Request from ${source} by ${user?.username}.`);

  return { db, session, user, token: authToken };
};

/**
 * tRPC API Initialization
 *
 * Initializes the tRPC API with:
 * - Type-safe Context
 * - SuperJSON Transformer
 * - Error Formatting
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/**
 * Server-side Caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Router & Procedure Exports
 * Core building blocks for the tRPC API
 */

/**
 * Factory for API Routes
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Development Helper Middleware
 * - Execution Time
 * - Artificial Network Delay (Dev Only)
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();
  const end = Date.now();

  log.info(`[TRPC] ${path} took ${end - start}ms to execute.`);

  return result;
});

/**
 * Public Procedure
 * A procedure that can be called regardless of authentication
 */
export const publicProcedure = () => t.procedure.use(timingMiddleware);

/**
 * Protected Procedure
 * - A procedure that can only be called if the user is authenticated
 * - Role-based Access Control
 *
 * @param roles - An optional array of allowed user roles
 * @throws {TRPCError} UNAUTHORIZED - Thrown if the user is not authenticated
 * @throws {TRPCError} FORBIDDEN - Thrown if the user lacks every defined role
 */
export const protectedProcedure = (
  roles?: (typeof users.role.enumValues)[number][],
) =>
  t.procedure.use(timingMiddleware).use(({ ctx, next }) => {
    if (!ctx.user)
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    if (
      roles?.length &&
      !roles.includes(ctx.user.role as (typeof users.role.enumValues)[number])
    )
      throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden" });

    return next({ ctx: { user: ctx.user } });
  });
