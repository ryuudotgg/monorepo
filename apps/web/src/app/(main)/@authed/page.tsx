import { headers } from "next/headers";

import { auth } from "@ryuu/auth";
import { Button } from "@ryuu/design/components/ui/button";

import Logo from "~/assets/logo.svg";

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center gap-3">
      <span className="inline-flex">
        <Logo className="text-foreground size-10" />
        <span className="sr-only">Ryuu</span>
      </span>
      <p>Secret!</p>
      <form>
        <Button
          formAction={async () => {
            "use server";
            await auth.signOut({ headers: await headers() });
          }}
        >
          Sign Out
        </Button>
      </form>
    </div>
  );
}
