import { timestamp } from "drizzle-orm/mysql-core";

export const dates = {
  createdAt: timestamp({ mode: "date", fsp: 3 }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: "date", fsp: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const omitDates = {
  createdAt: true as const,
  updatedAt: true as const,
};
