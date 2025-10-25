import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const formattingPlugin: EditorPlugin = {
  name: "formatting",
  init(editor: Editor) {
    // ------------------- Register commands -------------------
    editor.registerCommand("bold", () => {
      const range = editor.getSelectionRange();
      if (!range || range.collapsed) return;

      const parent = editor.getParentElement();
      if (parent?.tagName === "STRONG")
        return editor.removeParentElement(parent);

      editor.exec((frag) => {
        const el = document.createElement("strong");
        el.appendChild(frag);
        return el;
      });
    });

    editor.registerCommand("italic", () => {
      const range = editor.getSelectionRange();
      if (!range || range.collapsed) return;

      const parent = editor.getParentElement();
      if (parent?.tagName === "EM") return editor.removeParentElement(parent);

      editor.exec((frag) => {
        const el = document.createElement("em");
        el.appendChild(frag);
        return el;
      });
    });

    editor.registerCommand("underline", () => {
      const range = editor.getSelectionRange();
      if (!range || range.collapsed) return;

      const parent = editor.getParentElement();
      if (parent?.tagName === "U") return editor.removeParentElement(parent);

      editor.exec((frag) => {
        const el = document.createElement("u");
        el.appendChild(frag);
        return el;
      });
    });

    editor.registerCommand("insertImage", async (url?: string) => {
      const range = editor.getSelectionRange();
      if (!range) return;

      const urlFromPrompt = await editor.ui.promptAsync("Enter image URL:");
      const imageUrl = url || urlFromPrompt;
      if (!imageUrl) return;

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "Inserted Image";
      img.style.maxWidth = "100%";

      range.insertNode(img);
      range.setStartAfter(img);
      range.setEndAfter(img);

      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });

    editor.registerCommand("heading", (tag: string) => {
      editor.exec((frag) => {
        const el = document.createElement(tag);
        el.appendChild(frag);
        return el;
      });
    });

    editor.registerCommand("align", (alignment: string) => {
      const range = editor.getSelectionRange();
      if (!range || range.collapsed) return;

      const parent = editor.getParentElement();
      if (parent && parent instanceof HTMLElement) {
        if (parent.tagName === "P") {
          parent.style.textAlign = alignment;
        } else {
          editor.exec((frag) => {
            const el = document.createElement("p");
            el.style.textAlign = alignment;
            el.appendChild(frag);
            return el;
          });
        }
      }
    });

    // ------------------- Setup UI buttons -------------------
    editor.ui.addButton("bold", {
      text: "<b>B</b>",
      tooltip: "Bold",
      onAction: () => editor.execCommand("bold"),
    });

    editor.ui.addButton("italic", {
      text: "<i>I</i>",
      tooltip: "Italic",
      onAction: () => editor.execCommand("italic"),
    });

    editor.ui.addButton("underline", {
      text: "<u>U</u>",
      tooltip: "Underline",
      onAction: () => editor.execCommand("underline"),
    });

    editor.ui.addButton("image", {
      text: "🖼️ Image",
      tooltip: "Insert Image",
      onAction: () => editor.execCommand("insertImage"),
    });

    // ------------------- Formatting dropdown -------------------
    editor.ui.addDropdown("format", {
      text: "Format",
      tooltip: "Text format",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p"].map((tag) => ({
        label: tag.toUpperCase(),
        value: tag,
        onSelect: () => editor.execCommand("heading", tag),
      })),
    });

    // ------------------- Alignment dropdown -------------------
    const alignOptions = [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
      { label: "Justify", value: "justify" },
    ];

    editor.ui.addDropdown("align", {
      text: "Align",
      tooltip: "Text alignment",
      options: alignOptions.map((opt) => ({
        label: opt.label,
        value: opt.value,
        onSelect: () => editor.execCommand("align", opt.value),
      })),
    });
  },
};
