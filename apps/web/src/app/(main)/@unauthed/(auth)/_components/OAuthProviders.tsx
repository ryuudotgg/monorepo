"use client";

import { authClient } from "@ryuu/auth/react";
import { Button } from "@ryuu/design/components/ui/button";

import Apple from "~/assets/apple.svg";
import Discord from "~/assets/discord.svg";
import Google from "~/assets/google.svg";

export default function OAuthProviders({
  page,
}: {
  page: "sign-in" | "sign-up";
}) {
  return (
    <form>
      {/* Discord Provider */}
      <span className="relative block rounded-[5px]">
        <Button
          size="lg"
          className="max-w-full min-w-full"
          onClick={() =>
            authClient.signIn.social({
              provider: "discord",
              errorCallbackURL: `/${page}/invalid`,
            })
          }
        >
          <span className="mr-[2px] flex min-w-5 shrink-0 items-center justify-center">
            <Discord className="h-5" />
          </span>
          <span className="inline-block truncate px-[6px]">
            Continue with Discord
          </span>
        </Button>
      </span>
      {/* Discord Provider */}

      <span className="mt-[11px] ml-[23px] block h-[1px] min-h-[1px] w-[1px] min-w-[1px] select-none" />

      {/* Apple Provider */}
      <span className="relative block rounded-[5px]">
        <Button
          size="lg"
          className="max-w-full min-w-full"
          onClick={() =>
            authClient.signIn.social({
              provider: "apple",
              errorCallbackURL: `/${page}/invalid`,
            })
          }
        >
          <span className="mr-[2px] flex min-w-5 shrink-0 items-center justify-center">
            <Apple className="h-5" />
          </span>
          <span className="inline-block truncate px-[6px]">
            Continue with Apple
          </span>
        </Button>
      </span>
      {/* Apple Provider */}

      <span className="mt-[11px] ml-[23px] block h-[1px] min-h-[1px] w-[1px] min-w-[1px] select-none" />

      {/* Google Provider */}
      <span className="relative block rounded-[5px]">
        <Button
          size="lg"
          className="max-w-full min-w-full"
          onClick={() =>
            authClient.signIn.social({
              provider: "google",
              errorCallbackURL: `/${page}/invalid`,
            })
          }
        >
          <span className="mr-[2px] flex min-w-5 shrink-0 items-center justify-center">
            <Google className="text-foreground h-5" />
          </span>
          <span className="inline-block truncate px-[6px]">
            Continue with Google
          </span>
        </Button>
      </span>
      {/* Google Provider */}
    </form>
  );
}
