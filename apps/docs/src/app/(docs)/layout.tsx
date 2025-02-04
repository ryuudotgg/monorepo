import type { PageTree } from "fumadocs-core/server";
import type { IconName } from "lucide-react/dynamic";
import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";

import { Pump } from "@ryuu/cms/components/pump";

import { config } from "../config";

function Layout({ children }: { children: ReactNode }) {
  return (
    <Pump
      draft={true}
      queries={[
        {
          documentation: {
            items: { _slug: true, _title: true, category: true, icon: true },
          },
        },
      ]}
    >
      {async ([{ documentation }]) => {
        "use server";

        const items: PageTree.Node[] = [];

        for (const item of documentation.items) {
          let idx = items.length;

          if (item.category) {
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
            url: `/${item._slug}`,
            icon:
              item.icon &&
              Object.keys(dynamicIconImports).includes(
                item.icon as IconName,
              ) ? (
                <DynamicIcon name={item.icon as IconName} size={24} />
              ) : undefined,
          });
        }

        return (
          <DocsLayout
            {...config}
            tree={{ name: "Documentation", children: items }}
          >
            {children}
          </DocsLayout>
        );
      }}
    </Pump>
  );
}

export default Layout;
