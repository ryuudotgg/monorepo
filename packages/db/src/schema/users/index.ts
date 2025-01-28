import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { nanoidZod } from "@ryuu/shared/helpers";

import { dates, nanoid, omitDates, username, usernameZod } from "../../helpers";
import { accounts } from "./accounts";

export const users = mysqlTable(
  "users",
  {
    id: nanoid().primaryKey(),

    name: varchar({ length: 255 }),
    username: username().notNull().unique(),

    email: varchar({ length: 255 }).notNull().unique(),
    emailVerified: boolean().default(false).notNull(),

    image: varchar({ length: 255 }),

    role: mysqlEnum(["User", "Moderator", "Admin"]).notNull().default("User"),
    public: boolean().notNull().default(true),

    ...dates,
  },
  (user) => [index("users_created_at_idx").on(user.createdAt, user.id)],
);

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const createUsers = createInsertSchema(users, {
  username: usernameZod,

  email: (schema) => schema.email(),
  image: (schema) => schema.url(),
})
  .omit({ id: true, emailVerified: true, role: true })
  .omit(omitDates);

export const updateUsers = createUsers.partial().extend({ userId: nanoidZod });
export const deleteUsers = z.object({ userId: nanoidZod });

export * from "./accounts";
export * from "./passkeys";
export * from "./sessions";
export * from "./verifications";
