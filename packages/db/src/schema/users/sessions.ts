import { relations } from "drizzle-orm";
import {
  foreignKey,
  index,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { z } from "zod";

import { nanoidLength, nanoidZod } from "@purr/shared/helpers";

import { users } from ".";
import { dates, nanoid } from "../../helpers";

export const sessions = mysqlTable(
  "sessions",
  {
    id: nanoid().primaryKey(),

    userId: varchar({ length: nanoidLength }).notNull(),

    token: varchar({ length: 255 }).notNull(),
    expiresAt: timestamp({ mode: "date", fsp: 3 }).notNull(),

    ipAddress: varchar({ length: 255 }),
    userAgent: varchar({ length: 255 }),

    ...dates,
  },
  (session) => [
    uniqueIndex("sessions_token_uk").on(session.token),
    index("sessions_created_at_idx").on(session.createdAt, session.id),

    foreignKey({
      name: "sessions_user_id_fk",
      columns: [session.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
  ],
);

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const deleteSessions = z.object({ sessionId: nanoidZod });
