import type { Metadata } from "next";

import Logo from "~/assets/logo.svg";

export const metadata = {
  title: {
    absolute: "Ryuu: A modern starter for your next big thing.",
  },
} satisfies Metadata;

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center gap-3">
      <Logo className="text-foreground size-10" />
      <p>Woah!</p>
    </div>
  );
}
