"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PostHogProviderRaw } from "posthog-js/react";

import { env } from "../../env";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const analytics = posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  api_host: "/ingest",
  capture_pageleave: true,
  capture_pageview: false,
  person_profiles: "identified_only",
})!;

function PostHogProvider({ children }: { readonly children: ReactNode }) {
  return <PostHogProviderRaw client={analytics}>{children}</PostHogProviderRaw>;
}

export { PostHogProvider };
