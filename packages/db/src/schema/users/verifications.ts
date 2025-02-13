import {
  index,
  mysqlTable,
  timestamp,
  unique,
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
    unique("verifications_identifier_value_uk").on(
      verification.identifier,
      verification.value,
    ),

    index("verifications_identifier_idx").on(verification.identifier),
    index("verifications_created_at_idx").on(
      verification.createdAt,
      verification.id,
    ),
  ],
);
