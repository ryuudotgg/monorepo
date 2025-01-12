import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq } from "@ryuu/db";
import { usernameZod } from "@ryuu/db/helpers";
import { updateUsers, users } from "@ryuu/db/schema";
import { nanoidZod } from "@ryuu/shared/helpers";

import { protectedProcedure } from "../../trpc";

const schema = {
  select: {
    id: users.id,

    name: users.name,
    username: users.username,

    email: users.email,
    emailVerified: users.emailVerified,

    image: users.image,

    createdAt: users.createdAt,
  },
  output: z.object({
    id: nanoidZod,

    name: z.string().trim().min(1).nullable(),
    username: usernameZod,

    email: z.string().email(),
    emailVerified: z.boolean(),

    image: z.string().url().nullable(),

    createdAt: z.date(),
  }),
};

export const meRouter = {
  get: protectedProcedure()
    .input(z.undefined())
    .output(schema.output)
    .query(async ({ ctx }) => {
      const [record] = await ctx.db
        .select(schema.select)
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (!record)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Not Found",
        });

      return record;
    }),

  update: protectedProcedure()
    .input(updateUsers.omit({ userId: true }))
    .output(schema.output)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const { rowsAffected } = await tx
          .update(users)
          .set(input)
          .where(eq(users.id, ctx.user.id));

        if (!rowsAffected)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        const [record] = await tx
          .select(schema.select)
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1);

        if (!record)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        return record;
      });
    }),

  delete: protectedProcedure()
    .input(z.undefined())
    .output(schema.output)
    .mutation(async ({ ctx }) => {
      return ctx.db.transaction(async (tx) => {
        const [record] = await tx
          .select(schema.select)
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1);

        if (!record)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        const { rowsAffected } = await tx
          .delete(users)
          .where(eq(users.id, ctx.user.id));

        if (!rowsAffected)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Not Found",
          });

        return record;
      });
    }),
};
