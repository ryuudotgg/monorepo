import { createClient } from "@vercel/kv";

import { env } from "../env";

export const cache = createClient({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
});
