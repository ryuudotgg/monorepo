import type { PageTree } from "fumadocs-core/server";
import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { Pump } from "@ryuu/cms/components/pump";

import { config } from "../config";

function Layout({ children }: { children: ReactNode }) {
  return (
    <Pump
      draft={true}
      queries={[
        {
          documentation: {
            items: { _slug: true, _title: true, category: true },
          },
        },
      ]}
    >
      {async ([{ documentation }]) => {
        "use server";

        const items: PageTree.Node[] = [];

        for (const item of documentation.items) {
          let idx = items.length;

          if (item.category && item.category !== "Root") {
            idx = items.findIndex((parent) => parent.name === item.category);

            if (idx === -1) {
              items.push({
                type: "separator",
                name: item.category,
              });

              idx = items.length;
            }
          }

          items.splice(idx, 0, {
            type: "page",
            name: item._title,
            url: item._slug === "index" ? "/" : `/${item._slug}`,
          });
        }

        return (
          <DocsLayout
            tree={{
              name: "Documentation",
              children: items,
            }}
            {...config}
          >
            {children}
          </DocsLayout>
        );
      }}
    </Pump>
  );
}

export default Layout;
