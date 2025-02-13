import type { Metadata } from "next";

import AuthHeader from "../../_components/AuthHeader";

export const metadata = { title: "Sign Up" } satisfies Metadata;

export default function SignUpSuccess() {
  return (
    <div className="relative h-screen">
      <AuthHeader page="sign-up" />
      <main className="min-h-screen-no-header bg-background flex flex-col items-stretch justify-center">
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-col items-stretch justify-center gap-6 text-center">
            <h1 className="text-foreground m-0 text-[1.5rem] leading-8 font-bold -tracking-[0.029375rem]">
              Email Verification
            </h1>
            <p className="text-muted-foreground">
              You can close this window and open the link we just sent to your
              email.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
