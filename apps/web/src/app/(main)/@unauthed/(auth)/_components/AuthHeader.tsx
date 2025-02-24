import Link from "next/link";

import { Button } from "@ryuu/design/components";

import Logo from "~/assets/logo.svg";

interface Props {
  page: "sign-in" | "sign-up";
}

export default function AuthHeader({ page }: Props) {
  return (
    <header className="h-header min-h-header bg-background flex items-center px-4 sm:px-6">
      <Link href="/">
        <span className="fixed top-5 left-6 z-50 inline-flex">
          <Logo className="text-foreground size-6" aria-label="Ryuu Logo" />
          <span className="sr-only">Ryuu</span>
        </span>
      </Link>
      <nav className="h-header flex flex-1 flex-row items-center justify-end gap-3 pl-8">
        <Link
          className="transition-colors duration-1000 ease-in"
          href="mailto:contact@ryuu.gg"
        >
          <p className="text-muted-foreground hover:text-foreground m-0 text-sm font-normal transition-colors duration-150 ease-in">
            Contact
          </p>
        </Link>

        <Button variant="outline" size="sm" asChild>
          <Link href={page === "sign-in" ? "/sign-up" : "/sign-in"}>
            <span>{page === "sign-in" ? "Sign Up" : "Sign In"}</span>
          </Link>
        </Button>
      </nav>
    </header>
  );
}
