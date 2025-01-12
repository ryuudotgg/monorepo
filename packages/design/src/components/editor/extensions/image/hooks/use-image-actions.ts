import type { Node } from "@tiptap/pm/model";
import type { Editor } from "@tiptap/react";

import { isUrl } from "../../../utils";

interface UseImageActionsProps {
  editor: Editor;
  node: Node;
  src: string;
  onViewClick: (value: boolean) => void;
}

export interface ImageActionHandlers {
  onView?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  onCopyLink?: () => void;
  onRemoveImg?: () => void;
}

function useImageActions({
  src,
  node,
  editor,
  onViewClick,
}: UseImageActionsProps) {
  return {
    isLink: isUrl(src),
    onView: () => onViewClick(true),

    onDownload: () =>
      editor.commands.downloadImage({
        src: String(node.attrs.src),
        alt: String(node.attrs.alt),
      }),

    onCopy: () => editor.commands.copyImage({ src: String(node.attrs.src) }),
    onCopyLink: () => editor.commands.copyLink({ src: String(node.attrs.src) }),

    onRemoveImg: () => {
      editor.commands.command(({ tr, dispatch }) => {
        const { selection } = tr;
        const nodeAtSelection = tr.doc.nodeAt(selection.from);

        if (
          dispatch &&
          nodeAtSelection &&
          nodeAtSelection.type.name === "image"
        ) {
          tr.deleteSelection();
          return true;
        }

        return false;
      });
    },
  };
}

export { useImageActions };
