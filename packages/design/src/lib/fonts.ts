import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "~/lib/utils";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

const fonts = cn(
  sans.variable,
  mono.variable,
  "touch-manipulation font-sans antialiased",
);

export { fonts };
