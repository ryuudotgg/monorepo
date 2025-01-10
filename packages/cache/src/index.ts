import { createClient } from "@vercel/kv";

import { env } from "../env";

const client = createClient({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
});

export { client as cache };
