import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";

import { source } from "~/lib/source";
import { config } from "../layout.config";

const modifiedConfig = {
  ...config,
  links: config.links.slice(1),
} satisfies BaseLayoutProps;

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout {...modifiedConfig} tree={source.pageTree}>
      {children}
    </DocsLayout>
  );
}

export default Layout;
