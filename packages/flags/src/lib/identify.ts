import type { StatsigUser } from "@flags-sdk/statsig";
import type { ReadonlyHeaders } from "flags";
import { geolocation, ipAddress } from "@vercel/functions";
import { dedupe } from "flags/next";

import type { Session } from "@ryuu/auth";
import { auth } from "@ryuu/auth";

type Identify = (params: {
  user?: Session["user"];
  headers: ReadonlyHeaders;
}) => Promise<StatsigUser | undefined> | undefined;

export const identify = dedupe((async ({ user, headers }) => {
  user ??= (await auth.getSession({ headers }))?.user;
  if (!user) return;

  const ip = ipAddress({ headers });
  const { country } = geolocation({ headers });

  return {
    userID: user.id,
    email: user.email,
    country,
    ip,
  };
}) satisfies Identify);
