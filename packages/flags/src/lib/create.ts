import type { StatsigUser } from "@flags-sdk/statsig";
import type { Identify } from "flags";
import { geolocation, ipAddress } from "@vercel/functions";
import { dedupe, flag } from "flags/next";

import { auth } from "@ryuu/auth";

import { statsig } from "./statsig";

export const create = (key: string, defaultValue = false) =>
  flag<boolean, StatsigUser>({
    key,
    defaultValue,

    identify: dedupe((async ({ headers }) => {
      const { user } = (await auth.getSession({ headers })) ?? {};
      if (!user) return;

      const ip = ipAddress({ headers });
      const { country } = geolocation({ headers });

      return {
        userID: user.id,
        email: user.email,
        country,
        ip,
      };
    }) satisfies Identify<StatsigUser>),

    adapter: statsig.featureGate((gate) => gate.value),
  });
