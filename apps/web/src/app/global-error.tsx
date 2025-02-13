"use client";

import { useEffect } from "react";
import NextError from "next/error";

import { authClient } from "@ryuu/auth/react";
import { processError } from "@ryuu/observability/error";

export default function GlobalError({
  error,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const { data } = authClient.useSession();

  useEffect(() => {
    processError(error, { user: data?.user });
  }, [error, data?.user]);

  return (
    <html>
      <body>
        <NextError statusCode={500} />
      </body>
    </html>
  );
}
