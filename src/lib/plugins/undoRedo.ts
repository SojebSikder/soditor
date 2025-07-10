import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const undoRedoPlugin: EditorPlugin = {
  name: "undoRedo",
  init(editor: Editor) {
    editor.ui.addButton("undo", {
      text: "Undo",
      tooltip: "Undo",
      onAction: () => {
        editor.undo();
      },
    });
    editor.ui.addButton("redo", {
      text: "Redo",
      tooltip: "Redo",
      onAction: () => {
        editor.redo();
      },
    });

    // keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "z") {
        editor.undo();
      }
      if (e.ctrlKey && e.key === "y") {
        editor.redo();
      }
    });
  },
};
