import type { Editor } from "@tiptap/react";
import * as React from "react";
import { BubbleMenu } from "@tiptap/react";

import type { ShouldShowProps } from "../../types";
import { LinkEditBlock } from "../link/link-edit-block";
import { LinkPopoverBlock } from "../link/link-popover-block";

interface LinkBubbleMenuProps {
  editor: Editor;
}

interface LinkAttributes {
  href: string;
  target: string;
}

function LinkBubbleMenu({ editor }: LinkBubbleMenuProps) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [linkAttrs, setLinkAttrs] = React.useState<LinkAttributes>({
    href: "",
    target: "",
  });

  const [selectedText, setSelectedText] = React.useState("");

  const updateLinkState = () => {
    const { from, to } = editor.state.selection;
    const { href, target } = editor.getAttributes("link") as LinkAttributes;

    const text = editor.state.doc.textBetween(from, to, " ");

    setLinkAttrs({ href, target });
    setSelectedText(text);
  };

  const shouldShow = ({ editor, from, to }: ShouldShowProps) => {
    if (from === to) return false;

    const { href } = editor.getAttributes("link");
    if (href) {
      updateLinkState();
      return true;
    }

    return false;
  };

  const onSetLink = (url: string, text?: string, openInNewTab?: boolean) => {
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .insertContent({
        type: "text",
        text: text ?? url,
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
      .setLink({ href: url, target: openInNewTab ? "_blank" : "" })
      .run();

    setShowEdit(false);
    updateLinkState();
  };

  const onClearLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowEdit(false);
    updateLinkState();
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{
        placement: "bottom-start",
        onHidden: () => setShowEdit(false),
      }}
    >
      {showEdit ? (
        <LinkEditBlock
          defaultUrl={linkAttrs.href}
          defaultText={selectedText}
          defaultIsNewTab={linkAttrs.target === "_blank"}
          onSave={onSetLink}
          className="bg-popover text-popover-foreground w-full min-w-80 rounded-md border p-4 shadow-md outline-none"
        />
      ) : (
        <LinkPopoverBlock
          onClear={onClearLink}
          url={linkAttrs.href}
          onEdit={() => setShowEdit(true)}
        />
      )}
    </BubbleMenu>
  );
}

export { LinkBubbleMenu };
