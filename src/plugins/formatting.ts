import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const formattingPlugin: EditorPlugin = {
  name: "formatting",
  init(editor: Editor) {
    editor.addButton("bold", {
      text: "<b>B</b>",
      tooltip: "Bold",
      onAction: () => {
        const range = editor.getSelectionRange();
        if (!range || range.collapsed) return;

        const parent = editor.getParentElement();
        if (parent?.tagName == "STRONG") {
          return editor.removeParentElement(parent);
        }

        editor.exec((frag) => {
          const el = document.createElement("strong");
          el.appendChild(frag);
          return el;
        });
      },
    });

    editor.addButton("italic", {
      text: "<i>I</i>",
      tooltip: "Italic",
      onAction: () => {
        const range = editor.getSelectionRange();
        if (!range || range.collapsed) return;

        const parent = editor.getParentElement();
        if (parent?.tagName == "EM") {
          return editor.removeParentElement(parent);
        }

        editor.exec((frag) => {
          const el = document.createElement("em");
          el.appendChild(frag);
          return el;
        });
      },
    });

    editor.addButton("underline", {
      text: "<u>U</u>",
      tooltip: "Underline",
      onAction: () => {
        const range = editor.getSelectionRange();
        if (!range || range.collapsed) return;

        const parent = editor.getParentElement();
        if (parent?.tagName == "U") {
          return editor.removeParentElement(parent);
        }

        editor.exec((frag) => {
          const el = document.createElement("u");
          el.appendChild(frag);
          return el;
        });
      },
    });

    editor.addButton("image", {
      text: "🖼️ Image",
      tooltip: "Insert Image",
      onAction: () => {
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
      },
    });
  },

  destroy(editor: Editor) {
    // Optional: remove button or clean up
    // editor.toolbar.removeChild(editor.toolbar.querySelector("button") as HTMLElement);
  },
};
