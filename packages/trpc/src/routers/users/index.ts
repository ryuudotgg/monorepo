import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  and,
  asc,
  desc,
  eq,
  gt,
  isNotNull,
  isNull,
  lt,
  ne,
  or,
} from "@ryuu/db";
import { usernameZod } from "@ryuu/db/helpers";
import { createUsers, deleteUsers, updateUsers, users } from "@ryuu/db/schema";
import { nanoidZod } from "@ryuu/shared/helpers";
import { paginationSchema } from "@ryuu/validators";

import { protectedProcedure } from "../../trpc";

const schema = {
  select: {
    id: users.id,

    name: users.name,
    username: users.username,

    image: users.image,

    createdAt: users.createdAt,
  },
  output: z.object({
    id: nanoidZod,

    name: z.string().trim().min(1).nullable(),
    username: usernameZod,

    image: z.string().url().nullable(),

    createdAt: z.date(),
  }),
};

export const usersRouter = {
  all: protectedProcedure()
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
        .from(users)
        .where(
          and(
            ne(users.id, ctx.user.id),
            eq(users.public, true),

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
                      users.id,
                      lastRecord.id,
                    ),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(
          (input.orderDirection === "ASC" ? asc : desc)(orderBy),
          (input.orderDirection === "ASC" ? asc : desc)(users.id),
        )
        .limit(input.limit);
    }),

  byId: protectedProcedure()
    .input(z.object({ userId: nanoidZod }))
    .output(schema.output)
    .query(async ({ ctx, input: { userId } }) => {
      const [record] = await ctx.db
        .select(schema.select)
        .from(users)
        .where(
          and(
            eq(users.id, userId),
            ctx.user.id !== userId ? eq(users.public, true) : undefined,
          ),
        )
        .limit(1);

      if (!record)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Not Found",
        });

      return record;
    }),

  byUsername: protectedProcedure()
    .input(z.object({ username: usernameZod }))
    .output(schema.output)
    .query(async ({ ctx, input: { username } }) => {
      const [record] = await ctx.db
        .select(schema.select)
        .from(users)
        .where(
          and(
            eq(users.username, username),
            ctx.user.username !== username ? eq(users.public, true) : undefined,
          ),
        )
        .limit(1);

      if (!record)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Not Found",
        });

      return record;
    }),

  create: protectedProcedure(["Admin"])
    .input(createUsers)
    .output(schema.output)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const [result] = await tx.insert(users).values(input).$returningId();

        if (!result)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal Server Error",
          });

        const [record] = await tx
          .select(schema.select)
          .from(users)
          .where(eq(users.id, result.id))
          .limit(1);

        if (!record)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        return record;
      });
    }),

  update: protectedProcedure(["Admin"])
    .input(updateUsers)
    .output(schema.output)
    .mutation(async ({ ctx, input: { userId, ...data } }) => {
      return ctx.db.transaction(async (tx) => {
        const { rowsAffected } = await tx
          .update(users)
          .set(data)
          .where(eq(users.id, userId));

        if (!rowsAffected)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        const [record] = await tx
          .select(schema.select)
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (!record)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        return record;
      });
    }),

  delete: protectedProcedure(["Admin"])
    .input(deleteUsers)
    .output(schema.output)
    .mutation(async ({ ctx, input: { userId } }) => {
      return ctx.db.transaction(async (tx) => {
        const [result] = await tx
          .select(schema.select)
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (!result)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        const { rowsAffected } = await tx
          .delete(users)
          .where(eq(users.id, userId));

        if (!rowsAffected)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        return result;
      });
    }),
};
