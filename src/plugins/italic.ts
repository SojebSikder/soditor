import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const italicPlugin: EditorPlugin = {
  name: "italic",
  init(editor: Editor) {
    editor.addButton("<i>I</i>", () => {
      editor.exec((frag) => {
        const el = document.createElement("i");
        el.appendChild(frag);
        return el;
      });
    });
  },
};
