import "./styles/index.css";

import type { Content, Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

import { Separator } from "@ryuu/design/components";
import { cn } from "@ryuu/design/utils";

import type { UseTiptapEditorProps } from "./hooks/use-tiptap";
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu";
import { MeasuredContainer } from "./components/common/measured-container";
import { SectionFive } from "./components/toolbar/sections/five";
import { SectionFour } from "./components/toolbar/sections/four";
import { SectionOne } from "./components/toolbar/sections/one";
import { SectionThree } from "./components/toolbar/sections/three";
import { SectionTwo } from "./components/toolbar/sections/two";
import { useTiptapEditor } from "./hooks/use-tiptap";

export interface TiptapProps extends Omit<UseTiptapEditorProps, "onUpdate"> {
  value?: Content;
  className?: string;
  editorContentClassName?: string;
  onChange?: (value: Content) => void;
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="border-border shrink-0 overflow-x-auto border-b p-2">
      <div className="flex w-max items-center gap-px">
        <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionTwo
          editor={editor}
          activeActions={[
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "code",
            "clearFormatting",
          ]}
          mainActionCount={3}
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionThree editor={editor} />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFour
          editor={editor}
          activeActions={["orderedList", "bulletList"]}
          mainActionCount={0}
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFive
          editor={editor}
          activeActions={["codeBlock", "blockquote", "horizontalRule"]}
          mainActionCount={0}
        />
      </div>
    </div>
  );
}

function TiptapEditor({
  ref,
  value,
  onChange,
  className,
  editorContentClassName,
  ...props
}: React.ComponentProps<"div"> & TiptapProps) {
  const editor = useTiptapEditor({ value, onUpdate: onChange, ...props });
  if (!editor) return null;

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      ref={ref}
      className={cn(
        "border-input focus-within:border-primary flex h-auto min-h-72 w-full flex-col rounded-md border shadow-sm",
        className,
      )}
    >
      <Toolbar editor={editor} />

      <EditorContent
        editor={editor}
        className={cn("tiptap-editor", editorContentClassName)}
      />

      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  );
}

export { TiptapEditor };
