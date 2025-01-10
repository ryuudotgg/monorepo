import {
  index,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import { dates, nanoid } from "../../helpers";

export const verifications = mysqlTable(
  "verifications",
  {
    id: nanoid().primaryKey(),

    identifier: varchar({ length: 255 }).notNull(),
    value: varchar({ length: 255 }).notNull(),

    expiresAt: timestamp({ mode: "date", fsp: 3 }).notNull(),

    ...dates,
  },
  (verification) => [
    uniqueIndex("verifications_unique_idx").on(
      verification.identifier,
      verification.value,
    ),

    index("verifications_created_at_idx").on(
      verification.createdAt,
      verification.id,
    ),
  ],
);
