import type { MetadataRoute } from "next";

import { baseUrl } from "~/lib/base-url";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: String(new URL("/sitemap.xml", baseUrl)),
    rules: { userAgent: "*", allow: "/" },
  };
}
