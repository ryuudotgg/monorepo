import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

import { config, withAnalyzer } from "@ryuu/nextjs";
import { withSentry } from "@ryuu/observability/nextjs";

import { env } from "./src/env";

const withMDX = createMDX({
  configPath: "./fumadocs.config.ts",
});

let nextConfig: NextConfig = {
  serverExternalPackages: ["oxc-transform"],

  async rewrites() {
    const posthogRegion = env.NEXT_PUBLIC_POSTHOG_HOST?.includes(".eu.")
      ? "eu"
      : "us";

    return [
      {
        source: "/ingest/static/:path*",
        destination: `https://${posthogRegion}-assets.i.posthog.com/static/:path*`,
      },
      {
        source: "/ingest/:path*",
        destination: `https://${posthogRegion}.i.posthog.com/:path*`,
      },
      {
        source: "/ingest/decide",
        destination: `https://${posthogRegion}.i.posthog.com/decide`,
      },
    ];
  },

  ...config,
};

if (env.VERCEL) nextConfig = withSentry(nextConfig);
if (process.env.ANALYZE === "true") nextConfig = withAnalyzer(nextConfig);

export default withMDX(nextConfig);
