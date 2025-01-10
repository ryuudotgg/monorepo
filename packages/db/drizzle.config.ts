import { defineConfig } from "drizzle-kit";

import { env } from "./env";

export default defineConfig({
  dbCredentials: { url: env.DATABASE_URL },
  dialect: "mysql",
  out: "./src/drizzle",
  schema: "./src/schema/index.ts",
  casing: "snake_case",
});
