import type { NextConfig } from "next";

import { env } from "@ryuu/env";
import { config, withAnalyzer } from "@ryuu/nextjs";
import { withLogtail, withSentry } from "@ryuu/observability/nextjs";

let nextConfig: NextConfig = { ...config };

if (env.VERCEL) nextConfig = withSentry(nextConfig);
if (process.env.ANALYZE === "true") nextConfig = withAnalyzer(nextConfig);

export default withLogtail(nextConfig);
