import type { ComponentProps } from "react";
import { highlight } from "fumadocs-core/server";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";

import { RichText as Primitive } from "@ryuu/cms/components/rich-text";

const components = {
  async pre(props) {
    return highlight(props.code, {
      lang: props.language,
      themes: { light: "catppuccin-latte", dark: "vesper" },
      components: {
        pre: (props: ComponentProps<typeof Pre>) => (
          <CodeBlock {...props}>
            <Pre>{props.children}</Pre>
          </CodeBlock>
        ),
      },
    });
  },
} as ComponentProps<typeof Primitive>["components"];

function RichText(props: ComponentProps<typeof Primitive>) {
  return (
    <Primitive {...props} components={{ ...components, ...props.components }} />
  );
}

export { RichText };
