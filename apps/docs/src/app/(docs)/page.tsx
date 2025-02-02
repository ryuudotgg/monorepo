import { notFound } from "next/navigation";
import { Card, Cards } from "fumadocs-ui/components/card";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";

import { Pump } from "@ryuu/cms/components/pump";
import { RichText } from "@ryuu/cms/components/rich-text";

function Page() {
  return (
    <Pump
      queries={[
        {
          documentation: {
            items: {
              _slug: true,
              _title: true,
              richText: { json: { content: true } },
            },
          },
        },
      ]}
    >
      {async ([{ documentation }]) => {
        "use server";

        const [home, ...items] = documentation.items;
        if (!home) notFound();

        return (
          <DocsPage>
            <DocsTitle>Introduction</DocsTitle>
            <DocsBody className="text-sm">
              <RichText content={home.richText?.json.content} />
              <Cards>
                {items.map((item) => (
                  <Card
                    key={item._slug}
                    href={`/${item._slug}`}
                    title={item._title}
                  />
                ))}
              </Cards>
            </DocsBody>
          </DocsPage>
        );
      }}
    </Pump>
  );
}

export default Page;
