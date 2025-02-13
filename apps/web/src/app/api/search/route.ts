import { createSearchAPI } from "fumadocs-core/search/server";

import { fumadocs } from "~/lib/fumadocs";

export const { GET } = createSearchAPI("advanced", {
  indexes: await Promise.all(
    fumadocs.getPages().map(async (page) => {
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
