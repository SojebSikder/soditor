import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const contextMenuPlugin: EditorPlugin = {
  name: "contextMenu",
  init(editor: Editor) {
    const toolbar = editor.ui.createContextToolbar();

    editor.editor.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      toolbar.show({
        x: e.pageX,
        y: e.pageY,
        context: editor.editor,
        buttons: [
          {
            icon: "B",
            title: "Bold",
            onClick: () => {
              editor.execCommand("bold");
            },
          },
          {
            icon: "U",
            title: "Underline",
            onClick: () => {
              editor.execCommand("underline");
            },
          },
        ],
      });
    });
  },
};
