import type { ComponentProps } from "react";
import { RichText } from "basehub/react-rich-text";

function TableOfContents({
  content,
  ...props
}: ComponentProps<typeof RichText>) {
  return (
    <div>
      <RichText
        // @ts-expect-error Incorrect Types from BaseHub
        components={{
          ol: ({ children }) => (
            <ol className="flex list-none flex-col gap-2 text-sm">
              {children}
            </ol>
          ),
          ul: ({ children }) => (
            <ul className="flex list-none flex-col gap-2 text-sm">
              {children}
            </ul>
          ),
          li: ({ children }) => <li className="pl-3">{children}</li>,
          a: ({ children, href }) => (
            <a
              className="text-foreground decoration-foreground/0 hover:decoration-foreground/50 line-clamp-3 flex rounded-sm text-sm underline transition-colors"
              href={`#${href?.split("#").at(1)}`}
            >
              {children}
            </a>
          ),
        }}
        {...props}
      >
        {content}
      </RichText>
    </div>
  );
}

export { TableOfContents };
