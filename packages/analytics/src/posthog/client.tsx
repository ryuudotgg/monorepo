"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PostHogProviderRaw } from "posthog-js/react";

import { env } from "../../env";

const analytics = posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  api_host: "/ingest",
  capture_pageleave: true,
  capture_pageview: false,
  person_profiles: "identified_only",
});

function PostHogProvider({ children }: { children: ReactNode }) {
  return <PostHogProviderRaw client={analytics}>{children}</PostHogProviderRaw>;
}

export { analytics, PostHogProvider };
