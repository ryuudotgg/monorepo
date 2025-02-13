import type { Metadata, ServerRuntime } from "next";
import Link from "next/link";

import AuthHeader from "../../_components/AuthHeader";
import SignInEmailForm from "./form";

export const runtime: ServerRuntime = "nodejs";
export const metadata = { title: "Sign In" } satisfies Metadata;

export default function SignInEmail() {
  return (
    <div className="relative h-screen">
      <AuthHeader page="sign-in" />
      <main className="min-h-screen-no-header bg-background flex flex-col items-stretch justify-center">
        <div className="flex w-full flex-1 flex-col items-center justify-center self-center p-6">
          <div className="mb-4 max-w-[400px] text-center">
            <h1 className="text-foreground m-0 text-[2rem] leading-10 font-bold tracking-tighter">
              Sign in to Ryuu
            </h1>
          </div>

          <span className="mt-[23px] ml-[23px] block h-[1px] min-h-[1px] w-[1px] min-w-[1px] select-none" />

          <div className="w-full max-w-[320px]">
            <div className="flex flex-col items-center justify-start">
              <div className="w-full max-w-[320px]">
                <div className="flex min-h-[150px] flex-col items-stretch justify-start">
                  <SignInEmailForm />

                  <span className="mt-[23px] ml-[23px] block h-[1px] min-h-[1px] w-[1px] min-w-[1px] select-none" />

                  <div className="text-link text-center text-sm">
                    <Link href="/sign-in">← Other sign in options</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-border flex h-full w-full items-center justify-center border-t border-solid p-8">
          <p className="text-link m-0 text-base">
            <Link href="/sign-up">Don't have an account? Sign Up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
