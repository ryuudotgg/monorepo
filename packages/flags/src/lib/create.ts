import type { StatsigUser } from "@flags-sdk/statsig";
import { flag } from "flags/next";

import { statsig } from "../statsig/server";
import { identify } from "./identify";

export const createFeatureGate = (key: string, defaultValue = false) =>
  flag<boolean, StatsigUser>({
    key,
    defaultValue,
    identify,
    adapter: statsig.featureGate((gate) => gate.value),
  });
