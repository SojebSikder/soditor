import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const formattingPlugin: EditorPlugin = {
  name: "formatting",
  init(editor: Editor) {
    editor.addButton("<b>B</b>", () => {
      editor.exec((frag) => {
        const el = document.createElement("b");
        el.appendChild(frag);
        return el;
      });
    });

    editor.addButton("<i>I</i>", () => {
      editor.exec((frag) => {
        const el = document.createElement("i");
        el.appendChild(frag);
        return el;
      });
    });

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

  destroy(editor: Editor) {
    // Optional: remove button or clean up
    // editor.toolbar.removeChild(editor.toolbar.querySelector("button") as HTMLElement);
  },
};
