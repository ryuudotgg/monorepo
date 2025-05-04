import { headers } from "next/headers";

import { auth } from "@ryuu/auth";
import { identify } from "@ryuu/flags/identify";
import { statsig } from "@ryuu/flags/statsig";

import { StatsigProvider } from "./_components/StatsigProvider";

export default async function Layout({
  authed,
  unauthed,
}: {
  authed: React.ReactNode;
  unauthed: React.ReactNode;
}) {
  const headersList = await headers();

  const { user, session } =
    (await auth.getSession({ headers: headersList })) ?? {};

  const children = session ? authed : unauthed;
  const statsigUser = await identify({ user, headers: headersList });

  if (statsigUser) {
    const Statsig = await statsig.initialize();
    const datafile = Statsig.getClientInitializeResponse(statsigUser, {
      hash: "djb2",
    });

    if (datafile)
      return <StatsigProvider datafile={datafile}>{children}</StatsigProvider>;
  }

  return children;
}
