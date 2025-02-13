"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const params = useParams<{ token: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/api/auth/magic-link/verify?token=${params.token}`);
  }, [params.token, router]);

  return null;
}
