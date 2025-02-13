import { DocsLayout } from "fumadocs-ui/layouts/notebook";

import { fumadocs } from "~/lib/fumadocs";
import FumadocsProvider from "./_components/fumadocs";
import { config } from "./layout.config";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FumadocsProvider>
      <DocsLayout {...config} tree={fumadocs.pageTree}>
        {children}
      </DocsLayout>
    </FumadocsProvider>
  );
}

export default Layout;
