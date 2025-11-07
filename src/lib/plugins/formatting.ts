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
      text: `
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Bold">
  <path d="M6 4h8a4 4 0 0 1 0 8H6z" />
  <path d="M6 12h9a4 4 0 0 1 0 8H6z" />
</svg>

      `,
      tooltip: "Bold",
      onAction: () => editor.execCommand("bold"),
    });

    editor.ui.addButton("italic", {
      text: `
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Italic">
  <line x1="19" y1="4" x2="10" y2="4" />
  <line x1="14" y1="20" x2="5" y2="20" />
  <line x1="15" y1="4" x2="9" y2="20" />
</svg>

      `,
      tooltip: "Italic",
      onAction: () => editor.execCommand("italic"),
    });

    editor.ui.addButton("underline", {
      text: `
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Underline">
  <path d="M6 4v6a6 6 0 0 0 12 0V4" />
  <line x1="4" y1="20" x2="20" y2="20" />
</svg>

      `,
      tooltip: "Underline",
      onAction: () => editor.execCommand("underline"),
    });

    editor.ui.addButton("image", {
      text: `
      <!-- Image / Picture icon -->
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Image">
  <!-- Frame -->
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  <!-- Sun / circle -->
  <circle cx="8.5" cy="8.5" r="1.5" />
  <!-- Mountains / landscape -->
  <path d="M21 15l-5-5L5 21" />
</svg>

      `,
      tooltip: "Insert Image",
      onAction: () => editor.execCommand("insertImage"),
    });

    // ------------------- Formatting dropdown -------------------
    editor.ui.addDropdown("format", {
      text: `
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Format">
  <!-- Paragraph symbol P -->
  <path d="M10 4v16" />
  <path d="M10 4h6a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-6" />
</svg>

      `,
      tooltip: "Text format",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p"].map((tag) => ({
        label: tag.toUpperCase(),
        value: tag,
        onSelect: () => editor.execCommand("heading", tag),
      })),
    });

    // ------------------- Alignment dropdown -------------------
    const alignOptions = [
      {
        label: `
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Align Left">
  <line x1="3" y1="6" x2="21" y2="6" />
  <line x1="3" y1="12" x2="15" y2="12" />
  <line x1="3" y1="18" x2="21" y2="18" />
</svg>
        `,
        value: "left",
      },
      {
        label: `
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Align Center">
  <line x1="4" y1="6" x2="20" y2="6" />
  <line x1="8" y1="12" x2="16" y2="12" />
  <line x1="4" y1="18" x2="20" y2="18" />
</svg>
        `,
        value: "center",
      },
      {
        label: `
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Align Right">
  <line x1="3" y1="6" x2="21" y2="6" />
  <line x1="9" y1="12" x2="21" y2="12" />
  <line x1="3" y1="18" x2="21" y2="18" />
</svg>
        `,
        value: "right",
      },
      {
        label: `
        <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Align Justify">
  <line x1="3" y1="6" x2="21" y2="6" />
  <line x1="3" y1="12" x2="21" y2="12" />
  <line x1="3" y1="18" x2="21" y2="18" />
</svg>
        `,
        value: "justify",
      },
    ];

    editor.ui.addDropdown("align", {
      text: `
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Align Left">
  <line x1="3" y1="6" x2="21" y2="6" />
  <line x1="3" y1="12" x2="15" y2="12" />
  <line x1="3" y1="18" x2="21" y2="18" />
</svg>
      `,
      tooltip: "Text alignment",
      options: alignOptions.map((opt) => ({
        label: opt.label,
        value: opt.value,
        onSelect: () => editor.execCommand("align", opt.value),
      })),
    });
  },
};
