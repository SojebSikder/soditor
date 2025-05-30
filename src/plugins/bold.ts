import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const boldPlugin: EditorPlugin = {
  name: "bold",
  init(editor: Editor) {
    editor.addButton("<b>B</b>", () => {
      editor.exec((frag) => {
        const el = document.createElement("b");
        el.appendChild(frag);
        return el;
      });
    });
  },
};
