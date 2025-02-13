import { headers } from "next/headers";

import { auth } from "@ryuu/auth";

export default async function Layout({
  authed,
  unauthed,
}: {
  authed: React.ReactNode;
  unauthed: React.ReactNode;
}) {
  const { session } =
    (await auth.getSession({ headers: await headers() })) ?? {};

  return session ? authed : unauthed;
}
