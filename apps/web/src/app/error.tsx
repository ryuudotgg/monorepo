"use client";

import { useEffect } from "react";
import NextError from "next/error";

import { authClient } from "@ryuu/auth/react";
import { processError } from "@ryuu/observability/error";

export default function ErrorBoundary({
  error,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const { data } = authClient.useSession();

  useEffect(() => {
    processError(error, { user: data?.user });
  }, [error, data?.user]);

  return <NextError statusCode={500} />;
}
