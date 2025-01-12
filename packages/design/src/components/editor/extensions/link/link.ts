import type { EditorView } from "@tiptap/pm/view";
import TiptapLink from "@tiptap/extension-link";
import { Plugin, TextSelection } from "@tiptap/pm/state";
import { getMarkRange, mergeAttributes } from "@tiptap/react";

const Link = TiptapLink.extend({
  inclusive: false,

  parseHTML() {
    return [
      {
        tag: 'a[href]:not([data-type="button"]):not([href *= "javascript:" i])',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
      HTMLAttributes: { class: "link" },
    };
  },

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      ...(this.parent?.() || []),
      new Plugin({
        props: {
          handleKeyDown(_: EditorView, event: KeyboardEvent) {
            const { selection } = editor.state;

            if (event.key === "Escape" && selection.empty !== true)
              editor.commands.focus(selection.to, { scrollIntoView: false });

            return false;
          },

          handleClick(view, pos) {
            const { schema, doc, tr } = view.state;

            const range = getMarkRange(doc.resolve(pos), schema.marks.link!);
            if (!range) return;

            const { from, to } = range;

            const start = Math.min(from, to);
            const end = Math.max(from, to);

            if (pos < start || pos > end) return;

            const $start = doc.resolve(start);
            const $end = doc.resolve(end);

            const transaction = tr.setSelection(
              new TextSelection($start, $end),
            );

            view.dispatch(transaction);
          },
        },
      }),
    ];
  },
});

export { Link };
