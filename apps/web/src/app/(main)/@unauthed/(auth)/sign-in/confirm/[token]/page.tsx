import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign In" } satisfies Metadata;

export default async function SignInConfirm({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(`/api/auth/magic-link/verify?token=${token}`);
}
