/* eslint-disable @typescript-eslint/no-empty-function */

"use client";

import type { SortedResult } from "fumadocs-core/server";
import type { SharedProps } from "fumadocs-ui/components/dialog/search";
import { useSearch } from "basehub/react-search";
import { SearchDialog } from "fumadocs-ui/components/dialog/search";

function Search({
  _searchKey,
  ...props
}: SharedProps & { _searchKey: string }) {
  const search = useSearch<{
    _title: string;
    richText: string;
    category: string;
    slug: string;
  }>({
    _searchKey,
    queryBy: ["_title", "richText", "category", "slug"],
  });

  const results = search.result?.found
    ? search.result.hits.flatMap((hit) => {
        const items: SortedResult[] = [];
        const url = hit.document.slug ? `/${hit.document.slug}` : "/";

        items.push({
          id: hit._key,
          content: (
            <span className="font-medium">
              {hit.highlight?._title?.snippet ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: hit.highlight._title.snippet,
                  }}
                />
              ) : (
                hit.document._title
              )}
            </span>
          ) as unknown as string,
          type: "page",
          url,
        });

        for (const h of hit.highlights) {
          if (!h.snippet || h.fieldPath === "title") continue;

          items.push({
            id: `${hit._key}-${h.fieldPath}`,
            type: "text",
            content: (
              <span dangerouslySetInnerHTML={{ __html: h.snippet }} />
            ) as unknown as string,
            url,
          });
        }

        return items;
      })
    : "empty";

  return (
    <SearchDialog
      {...props}
      results={results}
      search={search.query ?? ""}
      onSearchChange={search.onQueryChange ?? (() => {})}
      isLoading={!!search.query?.length && !search.result}
    />
  );
}

export { Search };
