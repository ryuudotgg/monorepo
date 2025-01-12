import type { Content, UseEditorOptions } from "@tiptap/react";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { toast } from "sonner";

import { cn } from "@ryuu/design/lib/utils";

import { useThrottle } from "../../../hooks/use-throttle";
import {
  CodeBlock,
  Color,
  FileHandler,
  HorizontalRule,
  Image,
  Link,
  ResetMarksOnEnter,
  Selection,
  UnsetAllMarks,
} from "../extensions";
import { fileToBase64, getOutput, randomId } from "../utils";

export interface UseTiptapEditorProps extends UseEditorOptions {
  value?: Content;
  output?: "html" | "json" | "text";
  placeholder?: string;
  editorClassName?: string;
  throttleDelay?: number;
  onUpdate?: (content: Content) => void;
  onBlur?: (content: Content) => void;
}

function createExtensions(placeholder: string) {
  return [
    StarterKit.configure({
      horizontalRule: false,
      codeBlock: false,
      paragraph: { HTMLAttributes: { class: "text-node" } },
      heading: { HTMLAttributes: { class: "heading-node" } },
      blockquote: { HTMLAttributes: { class: "block-node" } },
      bulletList: { HTMLAttributes: { class: "list-node" } },
      orderedList: { HTMLAttributes: { class: "list-node" } },
      code: { HTMLAttributes: { class: "inline", spellcheck: "false" } },
      dropcursor: { width: 2, class: "ProseMirror-dropcursor border" },
    }),

    Link,
    Underline,

    Image.configure({
      allowedMimeTypes: ["image/*"],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowBase64: true,

      async uploadFn(file) {
        // NOTE: This is a fake upload function. Replace this with your own upload logic.
        // This function should return the uploaded image URL.

        // Wait 3 seconds to simulate an upload.
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const src = await fileToBase64(file);

        return { id: randomId(), src };
      },

      onToggle(editor, files, pos) {
        editor.commands.insertContentAt(
          pos,
          files.map((image) => {
            const blobUrl = URL.createObjectURL(image);
            const id = randomId();

            return {
              type: "image",
              attrs: {
                id,
                src: blobUrl,
                alt: image.name,
                title: image.name,
                fileName: image.name,
              },
            };
          }),
        );
      },

      onImageRemoved({ id, src }) {
        console.log("Image Removed", { id, src });
      },

      onValidationError(errors) {
        errors.forEach((error) => {
          toast.error("Validation Error", {
            position: "bottom-right",
            description: error.reason,
          });
        });
      },

      onActionSuccess({ action }) {
        const mapping = {
          copyImage: "Copy Image",
          copyLink: "Copy Link",
          download: "Download",
        };

        toast.success(mapping[action], {
          position: "bottom-right",
          description: "Successfully completed the action.",
        });
      },

      onActionError(error, { action }) {
        const mapping = {
          copyImage: "Copy Image",
          copyLink: "Copy Link",
          download: "Download",
        };

        toast.error(`Failed to ${mapping[action]}`, {
          position: "bottom-right",
          description: error.message,
        });
      },
    }),

    FileHandler.configure({
      allowedMimeTypes: ["image/*"],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowBase64: true,

      async onDrop(editor, files, pos) {
        for (const file of files) {
          const src = await fileToBase64(file);

          editor.commands.insertContentAt(pos, {
            type: "image",
            attrs: { src },
          });
        }
      },

      onPaste(editor, files) {
        files.forEach(async (file) => {
          const src = await fileToBase64(file);
          editor.commands.insertContent({
            type: "image",
            attrs: { src },
          });
        });
      },

      onValidationError(errors) {
        errors.forEach((error) => {
          toast.error("Validation Error", {
            position: "bottom-right",
            description: error.reason,
          });
        });
      },
    }),

    Color,
    TextStyle,
    Selection,
    Typography,
    UnsetAllMarks,
    HorizontalRule,
    ResetMarksOnEnter,
    CodeBlock,

    Placeholder.configure({ placeholder: () => placeholder }),
  ];
}

function useTiptapEditor({
  value,
  output = "html",
  placeholder = "",
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  ...props
}: UseTiptapEditorProps) {
  const throttledSetValue = useThrottle(
    (value: Content) => onUpdate?.(value),
    throttleDelay,
  );

  const editor = useEditor({
    extensions: createExtensions(placeholder),

    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-none", editorClassName),
      },
    },

    onCreate({ editor }) {
      if (value && editor.isEmpty) editor.commands.setContent(value);
    },

    onUpdate({ editor }) {
      return throttledSetValue(getOutput(editor, output));
    },

    onBlur({ editor }) {
      return onBlur?.(getOutput(editor, output));
    },

    ...props,
  });

  return editor;
}

export { useTiptapEditor };
