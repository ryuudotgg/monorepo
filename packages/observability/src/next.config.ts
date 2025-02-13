import { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

import { env } from "../env";

export const sentryConfig: Parameters<typeof withSentryConfig>[1] = {
  org: env.SENTRY_ORG,
  project: env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI.
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time).
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size.
  disableLogger: true,

  /*
   * Enables automatic instrumentation of Vercel Cron Monitors.
   * See the following for more information:
   * https://docs.sentry.io/product/crons
   * https://vercel.com/docs/cron-jobs
   */
  automaticVercelMonitors: true,
};

export const withSentry = (sourceConfig: NextConfig): NextConfig => {
  if (!sourceConfig.transpilePackages) sourceConfig.transpilePackages = [];
  sourceConfig.transpilePackages.push("@sentry/nextjs");

  return withSentryConfig(sourceConfig, sentryConfig);
};
