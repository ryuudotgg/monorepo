/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { createSearchAPI } from "fumadocs-core/search/server";

import { source } from "~/lib/source";

export const { GET } = createSearchAPI("advanced", {
  indexes: await Promise.all(
    source.getPages().map(async (page) => {
      const { structuredData } = await page.data.load();

      return {
        id: page.url,
        url: page.url,
        title: page.data.title,
        description: page.data.description,
        structuredData: structuredData,
      };
    }),
  ),
});
