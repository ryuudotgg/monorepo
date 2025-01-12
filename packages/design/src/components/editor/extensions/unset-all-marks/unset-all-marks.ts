import { Extension } from "@tiptap/react";

const UnsetAllMarks = Extension.create({
  addKeyboardShortcuts() {
    return {
      "Mod-\\": () => this.editor.commands.unsetAllMarks(),
    };
  },
});

export { UnsetAllMarks };
