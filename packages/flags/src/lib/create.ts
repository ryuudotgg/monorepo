import type { LDSingleKindContext } from "@launchdarkly/vercel-server-sdk";
import { geolocation, ipAddress, waitUntil } from "@vercel/functions";
import { decryptOverrides } from "flags";
import { flag } from "flags/next";

import { auth } from "@ryuu/auth";

import { launchDarkly } from "./launchdarkly";

export interface Entities {
  user:
    | {
        key: string;
        username: string;
        email: string;
        avatar?: string;
      }
    | { key: string; anonymous: true };

  geolocation: {
    ip?: string;
    city?: string;
    country?: string;
  };
}

export const create = (key: string, defaultValue = false) =>
  flag<boolean, Entities>({
    key,
    defaultValue,

    async identify({ headers }) {
      const { user } = (await auth.getSession({ headers })) ?? {};

      const ip = ipAddress({ headers });
      const { city, country } = geolocation({ headers });

      return {
        user: user?.id
          ? {
              key: user.id,
              username: user.username,
              email: user.email,
              avatar: user.image ?? undefined,
            }
          : { key: ip ?? "anonymous", anonymous: true },

        geolocation: { ip, city, country },
      };
    },

    async decide({ entities, cookies }) {
      const overrideCookie = cookies.get("vercel-flag-overrides")?.value;
      const overrides = overrideCookie
        ? await decryptOverrides(overrideCookie)
        : undefined;

      const isEnabled =
        Boolean(overrides?.[key]) ||
        (await launchDarkly.boolVariation(
          key,
          {
            kind: "user",
            ...entities?.user,
            ...entities?.geolocation,
          } as LDSingleKindContext,
          defaultValue,
        ));

      waitUntil(launchDarkly.flush());

      return isEnabled;
    },
  });
