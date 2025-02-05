/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { MetadataRoute } from "next";

import type { Page } from "~/lib/source";
import { baseUrl } from "~/lib/base-url";
import { source } from "~/lib/source";

export const revalidate = false;

function getUrl(path: string) {
  return new URL(path, baseUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return Promise.all(
    source.getPages().map(async (page: Page) => {
      const { lastModified } = await page.data.load();

      return {
        url: getUrl(page.url),
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: "weekly",
        priority: 0.5,
      } as MetadataRoute.Sitemap[number];
    }),
  );
}
