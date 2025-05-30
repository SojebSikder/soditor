import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const undoRedoPlugin: EditorPlugin = {
  name: "bold",
  init(editor: Editor) {
    editor.addButton("Undo", () => {
      editor.undo();
    });
    editor.addButton("Redo", () => {
      editor.redo();
    });
  },
};
