import { varchar } from "drizzle-orm/mysql-core";

import { nanoid as generate, nanoidLength } from "@ryuu/shared/helpers";

export const nanoid = (name?: string) =>
  name
    ? varchar(name, { length: nanoidLength }).$defaultFn(generate)
    : varchar({ length: nanoidLength }).$defaultFn(generate);
