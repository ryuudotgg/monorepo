import { Redis } from "@upstash/redis/cloudflare";

import { env } from "../env";

export const cache = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
  enableAutoPipelining: true,
  enableTelemetry: false,
});
