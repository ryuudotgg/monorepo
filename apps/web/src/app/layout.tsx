import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { VercelToolbar } from "@vercel/toolbar/next";

import { VercelAnalytics } from "@ryuu/analytics/vercel";
import { fonts } from "@ryuu/design/lib/fonts";

import { env } from "~/env";
import FumadocsProvider from "./_components/fumadocs";

export * from "./layout.seo";

async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={fonts}>
        <FumadocsProvider>
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
