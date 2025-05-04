import { getProviderData as getStatsigProviderData } from "@flags-sdk/statsig";
import { mergeProviderData } from "flags";
import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";

import * as flags from ".";
import { env } from "../env";

export const GET = createFlagsDiscoveryEndpoint(() => {
  const providerData = getProviderData(flags);
  const statsigProviderData = getStatsigProviderData({
    projectId: env.STATSIG_PROJECT_ID,
    consoleApiKey: env.STATSIG_CONSOLE_KEY,
  });

  return mergeProviderData([providerData, statsigProviderData]);
});
