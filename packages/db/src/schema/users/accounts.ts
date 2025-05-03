import { relations } from "drizzle-orm";
import {
  foreignKey,
  index,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { nanoidLength } from "@ryuu/shared/helpers";

import { users } from ".";
import { dates, nanoid } from "../../helpers";

export const accounts = mysqlTable(
  "accounts",
  {
    id: nanoid().primaryKey(),

    userId: varchar({ length: nanoidLength }).notNull(),

    accountId: varchar({ length: 255 }).notNull(),
    providerId: varchar({ length: 255 }).notNull(),

    accessToken: varchar({ length: 255 }),
    accessTokenExpiresAt: timestamp({ mode: "date", fsp: 3 }),

    refreshToken: varchar({ length: 255 }),
    refreshTokenExpiresAt: timestamp({ mode: "date", fsp: 3 }),

    idToken: text(),
    scope: text(),

    ...dates,
  },
  (account) => [
    index("accounts_user_id_idx").on(account.userId),
    index("accounts_created_at_idx").on(account.createdAt, account.id),

    foreignKey({
      name: "accounts_user_id_fk",
      columns: [account.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
  ],
);

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
