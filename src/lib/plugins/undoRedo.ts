import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const undoRedoPlugin: EditorPlugin = {
  name: "undoRedo",
  init(editor: Editor) {
    editor.ui.addButton("undo", {
      text: `
      <!-- Undo / corner-left (outline) -->
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Undo">
  <!-- arrow head -->
  <path d="M9 10 L4 15 L9 20" />
  <!-- curved path (undo tail) -->
  <path d="M20 5v6a4 4 0 0 1-4 4H4" />
</svg>

      `,
      tooltip: "Undo",
      onAction: () => {
        editor.undo();
      },
    });

    editor.ui.addButton("redo", {
      text: `
      <!-- Redo / corner-right (outline) -->
<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Redo">
  <!-- arrow head -->
  <path d="M15 10 L20 15 L15 20" />
  <!-- curved path (redo tail) -->
  <path d="M4 5v6a4 4 0 0 0 4 4h16" />
</svg>

      `,
      tooltip: "Redo",
      onAction: () => {
        editor.redo();
      },
    });

    // keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "z") {
        editor.undo();
      }
      if (e.ctrlKey && e.key === "y") {
        editor.redo();
      }
    });
  },
};
