"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PostHogProviderRaw } from "posthog-js/react";

import { env } from "../../env";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const analytics = posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: "/ingest",
  ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  person_profiles: "identified_only",
  capture_pageview: false, // Disable automatic pageview capture, as we capture manually.
  capture_pageleave: true, // Overrides the `capture_pageview` setting.
})!;

export const PostHogProvider = ({ children }: { children: ReactNode }) => (
  <PostHogProviderRaw client={analytics}>{children}</PostHogProviderRaw>
);
