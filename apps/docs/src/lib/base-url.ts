import { env } from "~/env";

export const baseUrl = new URL(
  env.VERCEL
    ? `https://create.ryuu.gg`
    : `http://localhost:${env.PORT ?? 3002}`,
);
