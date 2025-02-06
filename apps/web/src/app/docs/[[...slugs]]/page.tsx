/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { notFound } from "next/navigation";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Callout } from "fumadocs-ui/components/callout";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";

import { source } from "~/lib/source";

export const revalidate = false;
export const dynamicParams = false;

async function Page(props: { params: Promise<{ slugs: string[] }> }) {
  const params = await props.params;

  const page = source.getPage(params.slugs);
  if (!page) notFound();

  const path = `apps/web/src/content/docs/${page.file.path}`;
  const { body: MDX, toc, lastModified } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      lastUpdate={lastModified}
      tableOfContent={{ style: "clerk", single: false }}
      editOnGithub={{
        owner: "ryuudotgg",
        repo: "create-ryuu-app",
        sha: "main",
        path,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="text-fd-foreground/80">
        <MDX
          components={{
            ...defaultComponents,
            blockquote: Callout,
            Tab,
            Tabs,
            TypeTable,
            Accordion,
            Accordions,
            File,
            Files,
            Folder,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams(): { slugs: string[] }[] {
  return source.generateParams("slugs");
}

export default Page;
