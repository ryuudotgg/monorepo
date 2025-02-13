import type { MetadataRoute } from "next";

import { removeTrailingSlash } from "@ryuu/shared/helpers";

import { baseUrl } from "~/lib/base-url";
import { fumadocs } from "~/lib/fumadocs";

export const revalidate = false;

function getUrl(path?: string) {
  if (!path) return removeTrailingSlash(baseUrl);
  return removeTrailingSlash(new URL(path, baseUrl));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: getUrl(),
      priority: 1,
    },
    {
      url: getUrl("/sign-in"),
      priority: 0.5,
    },
    {
      url: getUrl("/sign-up"),
      priority: 0.5,
    },
  ];

  const docs = await Promise.all(
    fumadocs.getPages().map(async (page) => {
      const { lastModified } = await page.data.load();

      return {
        url: getUrl(page.url),
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: "weekly",
        priority: 0.5,
      } as MetadataRoute.Sitemap[number];
    }),
  );

  routes.push(...docs);

  return routes;
}
