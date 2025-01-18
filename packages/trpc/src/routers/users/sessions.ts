import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, asc, desc, eq, gt, isNotNull, isNull, lt, or } from "@ryuu/db";
import { sessions } from "@ryuu/db/schema";
import { nanoidZod } from "@ryuu/shared/helpers";
import { paginationSchema } from "@ryuu/validators";

import { protectedProcedure } from "../../trpc";

const schema = {
  select: {
    id: sessions.id,

    expiresAt: sessions.expiresAt,

    ipAddress: sessions.ipAddress,
    userAgent: sessions.userAgent,

    createdAt: sessions.createdAt,
    updatedAt: sessions.updatedAt,
  },
  output: z.object({
    id: nanoidZod,

    expiresAt: z.date(),

    ipAddress: z.string().ip({ version: "v4" }).nullable(),
    userAgent: z.string().nullable(),

    createdAt: z.date(),
    updatedAt: z.date(),
  }),
};

export const sessionsRouter = {
  all: protectedProcedure()
    .meta({
      openapi: {
        method: "GET",
        path: "/users/me/sessions",
        summary: "All Sessions",
        description: "Get all sessions for the currently authenticated user.",
        tags: ["Sessions"],
        protect: true,
      },
    })
    .input(paginationSchema)
    .output(z.array(schema.output))
    .query(async ({ ctx, input }) => {
      if (!(input.orderBy in schema.select))
        throw new TRPCError({ code: "BAD_REQUEST", message: "Bad Request" });

      const orderBy =
        schema.select[input.orderBy as keyof typeof schema.select];

      const [lastRecord] = input.cursor
        ? await ctx.db
            .select({ id: schema.select.id, orderBy })
            .from(orderBy.table)
            .where(eq(schema.select.id, input.cursor))
            .limit(1)
        : [];

      return ctx.db
        .select(schema.select)
        .from(sessions)
        .where(
          and(
            eq(sessions.userId, ctx.user.id),

            lastRecord
              ? or(
                  lastRecord.orderBy === null
                    ? input.orderBy === "ASC"
                      ? isNotNull(orderBy)
                      : isNull(orderBy)
                    : (input.orderDirection === "ASC" ? gt : lt)(
                        orderBy,
                        lastRecord.orderBy,
                      ),

                  and(
                    lastRecord.orderBy === null
                      ? isNull(orderBy)
                      : eq(orderBy, lastRecord.orderBy),

                    (input.orderDirection === "ASC" ? gt : lt)(
                      sessions.id,
                      lastRecord.id,
                    ),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(
          (input.orderDirection === "ASC" ? asc : desc)(orderBy),
          (input.orderDirection === "ASC" ? asc : desc)(sessions.id),
        )
        .limit(input.limit);
    }),

  byId: protectedProcedure()
    .meta({
      openapi: {
        method: "GET",
        path: "/users/me/sessions/{sessionId}",
        summary: "Session by ID",
        description: "Get a session for the currently authenticated user.",
        tags: ["Sessions"],
        protect: true,
      },
    })
    .input(z.object({ sessionId: nanoidZod }))
    .output(schema.output)
    .query(async ({ ctx, input: { sessionId } }) => {
      const [record] = await ctx.db
        .select(schema.select)
        .from(sessions)
        .where(
          and(eq(sessions.userId, ctx.user.id), eq(sessions.id, sessionId)),
        )
        .limit(1);

      if (!record)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Not Found",
        });

      return record;
    }),

  delete: protectedProcedure()
    .meta({
      openapi: {
        method: "DELETE",
        path: "/users/me/sessions/{sessionId}",
        summary: "Delete Session",
        description: "Delete a session for the currently authenticated user.",
        tags: ["Sessions"],
        protect: true,
      },
    })
    .input(z.object({ sessionId: nanoidZod }))
    .output(schema.output)
    .mutation(async ({ ctx, input: { sessionId } }) => {
      return ctx.db.transaction(async (tx) => {
        const [record] = await tx
          .select(schema.select)
          .from(sessions)
          .where(
            and(eq(sessions.userId, ctx.user.id), eq(sessions.id, sessionId)),
          )
          .limit(1);

        if (!record)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        const { rowsAffected } = await tx
          .delete(sessions)
          .where(
            and(eq(sessions.userId, ctx.user.id), eq(sessions.id, sessionId)),
          );

        if (!rowsAffected)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        return record;
      });
    }),
};
