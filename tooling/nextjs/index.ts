import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import withVercelToolbar from "@vercel/toolbar/plugins/next";
import { createSecureHeaders } from "next-secure-headers";

import { env } from "@ryuu/blob/env";

export const config: NextConfig = withVercelToolbar()({
  reactStrictMode: true,

  transpilePackages: [
    "@ryuu/analytics",
    "@ryuu/auth",
    "@ryuu/blob",
    "@ryuu/cache",
    "@ryuu/db",
    "@ryuu/design",
    "@ryuu/emails",
    "@ryuu/env",
    "@ryuu/flags",
    "@ryuu/observability",
    "@ryuu/security",
    "@ryuu/shared",
    "@ryuu/trpc",
    "@ryuu/validators",
  ],

  images: {
    // @ts-ignore
    remotePatterns: [
      ...(env.NEXT_PUBLIC_BLOB_URL
        ? [
            {
              protocol: "https",
              hostname: env.NEXT_PUBLIC_BLOB_URL.replace("https://", ""),
            },
          ]
        : []),
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecureHeaders({
          forceHTTPSRedirect: [
            true,
            { maxAge: 63_072_000, includeSubDomains: true, preload: true },
          ],
        }),
      },
    ];
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ["@svgr/webpack"],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    config.ignoreWarnings = [{ module: /@opentelemetry\/instrumentation/ }];

    return config;
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // This is required to support PostHog trailing slash API requests.
  skipTrailingSlashRedirect: true,
});

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer()(sourceConfig);
