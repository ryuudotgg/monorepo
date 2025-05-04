"use client";

import type { Statsig } from "@flags-sdk/statsig";
import {
  StatsigProvider as ReactStatsigProvider,
  useClientBootstrapInit,
} from "@statsig/react-bindings";

import { env } from "../../env";

export function StatsigProvider({
  children,
  datafile,
}: {
  children: React.ReactNode;
  datafile: Awaited<ReturnType<typeof Statsig.getClientInitializeResponse>>;
}) {
  if (!datafile) throw new Error("Missing DATAFILE");

  const datafileString = JSON.stringify(datafile);
  const client = useClientBootstrapInit(
    env.NEXT_PUBLIC_STATSIG_CLIENT_KEY,
    datafile.user,
    datafileString,
  );

  return (
    <ReactStatsigProvider user={datafile.user} client={client}>
      {children}
    </ReactStatsigProvider>
  );
}
