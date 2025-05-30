import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const formattingPlugin: EditorPlugin = {
  name: "formatting",
  init(editor: Editor) {
    editor.addButton("bold", {
      text: "<b>B</b>",
      tooltip: "Bold",
      onAction: () => {
        editor.exec((frag) => {
          const el = document.createElement("b");
          el.appendChild(frag);
          return el;
        });
      },
    });

    // editor.addButton("Bold", () => {
    //   const range = editor.getSelectionRange();
    //   if (!range || range.collapsed) return;

    //   const sel = window.getSelection();
    //   const parent = sel?.anchorNode?.parentElement;

    //   const isBold = parent?.style?.fontWeight === "bold";

    //   editor.exec((fragment) => {
    //     const span = document.createElement("span");

    //     // If already bold, remove bold by unwrapping
    //     if (isBold) {
    //       const wrapper = document.createDocumentFragment();
    //       wrapper.appendChild(fragment);
    //       return wrapper;
    //     }

    //     // Apply bold style
    //     span.style.fontWeight = "bold";
    //     span.appendChild(fragment);
    //     return span;
    //   });
    // });

    editor.addButton("italic", {
      text: "<i>I</i>",
      tooltip: "Italic",
      onAction: () => {
        editor.exec((frag) => {
          const el = document.createElement("i");
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
