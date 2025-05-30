import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const imagePlugin: EditorPlugin = {
  name: "image",
  init(editor: Editor) {
    editor.addButton("🖼️ Image", () => {
      const url = prompt("Enter image URL:");
      if (!url) return;

      const range = editor.getSelectionRange();
      if (!range) return;

      const img = document.createElement("img");
      img.src = url;
      img.alt = "Inserted Image";
      img.style.maxWidth = "100%";

      range.insertNode(img);
      range.setStartAfter(img);
      range.setEndAfter(img);

      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  },
};
