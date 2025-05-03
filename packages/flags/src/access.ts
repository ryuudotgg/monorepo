import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";

import * as flags from ".";

export const GET = createFlagsDiscoveryEndpoint(() => {
  const apiData = getProviderData(flags);
  return apiData;
});
