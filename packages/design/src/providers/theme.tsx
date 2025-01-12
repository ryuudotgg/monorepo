import type { ThemeProvider as NextThemes } from "next-themes";
import { ThemeProvider as ThemeProviderRaw } from "next-themes";

function ThemeProvider(properties: React.ComponentProps<typeof NextThemes>) {
  return (
    <ThemeProviderRaw
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...properties}
    />
  );
}

export { ThemeProvider };
