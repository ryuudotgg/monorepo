import "./globals.css";

import type { ServerRuntime } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VercelToolbar } from "@vercel/toolbar/next";

import { VercelAnalytics } from "@ryuu/analytics/vercel";
import { basehub } from "@ryuu/cms";
import { fonts } from "@ryuu/design/lib/fonts";

import { env } from "~/env";
import FumadocsProvider from "./_components/fumadocs";

export const runtime: ServerRuntime = "edge";
export * from "./seo";

async function RootLayout({ children }: { children: React.ReactNode }) {
  const { documentation } = await basehub.query({
    documentation: { _searchKey: true },
  });

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={fonts}>
        <FumadocsProvider _searchKey={documentation._searchKey}>
          {children}

          <SpeedInsights />
          <VercelAnalytics />

          {env.NODE_ENV === "development" && <VercelToolbar />}
        </FumadocsProvider>
      </body>
    </html>
  );
}

export default RootLayout;
