"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import {
  PostHogProvider as RawPostHogProvider,
  usePostHog,
} from "posthog-js/react";

import { env } from "../../env";

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      api_host: "/ingest",
      capture_pageleave: true,
      capture_pageview: false,
      person_profiles: "identified_only",
    });
  }, []);

  return (
    <RawPostHogProvider client={posthog}>
      {children}

      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
    </RawPostHogProvider>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname) {
      let url = `${window.origin}${pathname}`;
      if (String(searchParams)) url += `?${String(searchParams)}`;

      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}
