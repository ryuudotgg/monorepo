import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  int,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

import { nanoidLength } from "@ryuu/shared/helpers";

import { users } from ".";
import { dates, nanoid } from "../../helpers";

export const passkeys = mysqlTable(
  "passkeys",
  {
    id: nanoid().primaryKey(),
    userId: varchar({ length: nanoidLength }).notNull(),

    name: varchar({ length: 255 }),

    credentialID: varchar({ length: 255 }).notNull(),
    publicKey: text().notNull(),

    counter: int().notNull(),

    backedUp: boolean().notNull(),
    deviceType: varchar({ length: 255 }).notNull(),

    transports: text().notNull(),

    ...dates,
  },
  (account) => [
    index("passkeys_user_id_idx").on(account.userId),
    index("passkeys_created_at_idx").on(account.createdAt, account.id),

    foreignKey({
      name: "passkeys_user_id_fk",
      columns: [account.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
  ],
);

export const passkeyRelations = relations(passkeys, ({ one }) => ({
  user: one(users, {
    fields: [passkeys.userId],
    references: [users.id],
  }),
}));
