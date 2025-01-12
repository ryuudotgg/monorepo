import { z } from "zod";

import { nanoidZod } from "@ryuu/shared/helpers";

export const paginationSchema = z
  .object({
    cursor: nanoidZod.optional(),
    limit: z.number().min(1).max(100).default(10),
    orderBy: z.string().trim().min(1).default("createdAt"),
    orderDirection: z.enum(["ASC", "DESC"]).default("DESC"),
  })
  .default({});
