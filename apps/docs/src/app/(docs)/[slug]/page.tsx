import type { Metadata, ServerRuntime } from "next";
import { notFound } from "next/navigation";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";

import { basehub } from "@ryuu/cms";
import { Pump } from "@ryuu/cms/components/pump";

import { RichText } from "~/components/rich-text";
import { parseToc } from "./toc";

export const runtime: ServerRuntime = "nodejs";

async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  return (
    <Pump
      queries={[
        {
          documentation: {
            __args: { filter: { _sys_slug: { eq: params.slug } } },
            item: {
              _title: true,
              _sys: { lastModifiedAt: true },
              richText: { json: { content: true, toc: true } },
            },
          },
        },
      ]}
    >
      {async ([{ documentation }]) => {
        "use server";

        const page = documentation.item;
        if (!page) notFound();

        return (
          <DocsPage
            lastUpdate={new Date(page._sys.lastModifiedAt)}
            tableOfContent={{ style: "clerk" }}
            toc={
              page.richText?.json.toc[0]
                ? parseToc(page.richText.json.toc[0])
                : []
            }
          >
            <DocsTitle>{page._title}</DocsTitle>
            <DocsBody className="text-fd-foreground/80">
              <RichText content={page.richText?.json.content} />
            </DocsBody>
          </DocsPage>
        );
      }}
    </Pump>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { documentation } = await basehub.query({
    documentation: {
      __args: { filter: { _sys_slug: { eq: params.slug } }, first: 1 },
      items: { _title: true, category: true },
    },
  });

  const page = documentation.items.at(0);
  if (!page) notFound();

  return {
    title: page._title,
    description: page.category,
  } satisfies Metadata;
}

export async function generateStaticParams() {
  const { documentation } = await basehub.query({
    documentation: { items: { _slug: true } },
  });

  return documentation.items
    .filter((item) => item._slug !== "index")
    .map((item) => ({ slug: item._slug }));
}

export default Page;
