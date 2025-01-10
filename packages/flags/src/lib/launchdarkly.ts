import { init } from "@launchdarkly/vercel-server-sdk";
import { createClient } from "@vercel/edge-config";

import { env } from "../../env";

const launchDarkly = init(
  env.LAUNCHDARKLY_CLIENT_ID,
  createClient(process.env.EDGE_CONFIG),
  { sendEvents: true },
);

await launchDarkly.waitForInitialization();

export { launchDarkly };
