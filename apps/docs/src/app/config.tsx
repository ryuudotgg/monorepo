import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import Logo from "~/assets/logo.svg";

export const config = {
  nav: {
    title: (
      <>
        <Logo className="size-6" />
        <span className="font-medium whitespace-nowrap">Create Ryuu App</span>
      </>
    ),
  },
  githubUrl: "https://github.com/ryuudotgg/create-ryuu-app",
  links: [
    {
      text: "Home",
      url: "https://create.ryuu.gg",
      external: true,
    },
    {
      text: "API Reference",
      url: "https://api.create.ryuu.gg/docs",
      external: true,
    },
  ],
} satisfies BaseLayoutProps;
