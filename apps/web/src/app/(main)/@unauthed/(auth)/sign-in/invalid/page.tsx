import type { Metadata } from "next";
import Link from "next/link";

import AuthHeader from "../../_components/AuthHeader";

export const metadata = { title: "Sign In" } satisfies Metadata;

export default function Page() {
  return (
    <div className="relative h-screen">
      <AuthHeader page="sign-in" />
      <main className="min-h-screen-no-header bg-background flex flex-col items-stretch justify-center">
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-col items-stretch justify-center gap-6 text-center">
            <h1 className="text-foreground m-0 text-[1.5rem] leading-8 font-bold -tracking-[0.029375rem]">
              Invalid or Expired Link
            </h1>
            <p className="text-muted-foreground">
              This link is invalid or has expired.
            </p>
            <Link href="/sign-up">← Back to Sign In</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
