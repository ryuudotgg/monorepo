import type { StatsigUser } from "@flags-sdk/statsig";
import { flag } from "flags/next";

import { identify } from "./identify";
import { statsig } from "./statsig";

export const createFeatureGate = (key: string, defaultValue = false) =>
  flag<boolean, StatsigUser>({
    key,
    defaultValue,
    identify,
    adapter: statsig.featureGate((gate) => gate.value),
  });
