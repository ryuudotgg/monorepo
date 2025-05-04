import type { Statsig } from "@flags-sdk/statsig";
import { createStatsigAdapter } from "@flags-sdk/statsig";

import { env } from "../../env";

const statsig = createStatsigAdapter({
  statsigServerApiKey: env.STATSIG_API_KEY,
  statsigProjectId: env.STATSIG_PROJECT_ID,
  edgeConfig: {
    connectionString: env.STATSIG_EDGE_CONFIG,
    itemKey: env.STATSIG_EDGE_CONFIG_KEY,
  },
});

export { statsig };
export type { Statsig };
