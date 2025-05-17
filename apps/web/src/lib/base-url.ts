import { env } from "~/env";

export const baseUrl = new URL(
  env.VERCEL
    ? `https://monorepo.ryuu.gg`
    : `http://localhost:${env.PORT ?? 3000}`,
);
