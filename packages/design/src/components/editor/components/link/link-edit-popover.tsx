import type { Editor } from "@tiptap/react";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Link2Icon } from "@radix-ui/react-icons";

import type { toggleVariants } from "@ryuu/design/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ryuu/design/components/ui/popover";

import { ToolbarButton } from "../toolbar/toolbar-button";
import { LinkEditBlock } from "./link-edit-block";

interface LinkEditPopoverProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

function LinkEditPopover({ editor, size, variant }: LinkEditPopoverProps) {
  const [open, setOpen] = React.useState(false);

  const { from, to } = editor.state.selection;
  const text = editor.state.doc.textBetween(from, to, " ");

  const handleSetLink = (
    url: string,
    text?: string,
    openInNewTab?: boolean,
  ) => {
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .insertContent({
        type: "text",
        text: text || url,
        marks: [
          {
            type: "link",
            attrs: {
              href: url,
              target: openInNewTab ? "_blank" : "",
            },
          },
        ],
      })
      .setLink({ href: url })
      .run();

    editor.commands.enter();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ToolbarButton
          isActive={editor.isActive("link")}
          tooltip="Link"
          aria-label="Insert link"
          disabled={editor.isActive("codeBlock")}
          size={size}
          variant={variant}
        >
          <Link2Icon className="size-5" />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-80" align="end" side="bottom">
        <LinkEditBlock onSave={handleSetLink} defaultText={text} />
      </PopoverContent>
    </Popover>
  );
}

export { LinkEditPopover };
