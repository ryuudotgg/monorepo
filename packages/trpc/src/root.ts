import { usersRouter } from "./routers/users";
import { meRouter } from "./routers/users/me";
import { sessionsRouter } from "./routers/users/sessions";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  users: {
    ...usersRouter,
    me: { ...meRouter, sessions: sessionsRouter },
  },
});

export type AppRouter = typeof appRouter;
