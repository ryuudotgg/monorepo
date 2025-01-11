import type { FlagOverridesType } from "@vercel/flags";
import { decrypt } from "@vercel/flags";
import { unstable_flag as flag } from "@vercel/flags/next";
import { geolocation, ipAddress, waitUntil } from "@vercel/functions";

import { auth } from "@ryuu/auth";

import { launchDarkly } from "./launchdarkly";

const create = (key: string, defaultValue = false) =>
  flag({
    key,
    defaultValue,
    async decide({ headers, cookies }) {
      const { user } = (await auth.getSession({ headers })) ?? {};

      const ip = ipAddress({ headers });
      const { city, country } = geolocation({ headers });

      const overrideCookie = cookies.get("vercel-flag-overrides")?.value;
      const overrides = overrideCookie
        ? await decrypt<FlagOverridesType>(overrideCookie)
        : undefined;

      const isEnabled =
        overrides?.[key] ??
        (await launchDarkly.boolVariation(
          key,
          {
            kind: "user",
            country,
            city,
            ip,

            ...(user?.id
              ? {
                  key: user.id,
                  username: user.username,
                  email: user.email,
                  avatar: user.image ?? undefined,
                }
              : {
                  key: ip ?? "anonymous",
                  anonymous: true,
                }),
          },
          defaultValue,
        ));

      waitUntil(launchDarkly.flush());

      return isEnabled;
    },
  });

export { create };
