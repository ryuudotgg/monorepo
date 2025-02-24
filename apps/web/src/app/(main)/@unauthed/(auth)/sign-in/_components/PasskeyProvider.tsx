"use client";

import { authClient } from "@ryuu/auth/react";
import { Button } from "@ryuu/design/components/ui/button";

import Passkey from "~/assets/passkey.svg";

export default function PasskeyProvider() {
  return (
    <Button
      variant="outline"
      size="lg"
      className="max-w-full min-w-full"
      onClick={() => authClient.signIn.passkey()}
    >
      <span className="mr-[2px] flex min-w-5 shrink-0 items-center justify-center">
        <Passkey className="h-4" />
      </span>
      <span className="inline-block truncate px-[6px]">
        Sign in with Passkey
      </span>
    </Button>
  );
}
