import "./globals.css";

import { fonts } from "@ryuu/design/lib/fonts";
import { Provider } from "@ryuu/design/providers/index";

import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";

export * from "./layout.seo";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={fonts}>
        <TRPCReactProvider>
          <HydrateClient>
            <Provider>{children}</Provider>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
