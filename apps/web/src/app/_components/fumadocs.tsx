"use client";

import { RootProvider } from "fumadocs-ui/provider";

function FumadocsProvider({ children }: { children: React.ReactNode }) {
  return <RootProvider>{children}</RootProvider>;
}

export default FumadocsProvider;
