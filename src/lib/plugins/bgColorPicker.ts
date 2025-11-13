import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

/**
 * Text color plugin
 */
export const bgColorPickerPlugin: EditorPlugin = {
  name: "colorPicker",
  init(editor: Editor) {
    editor.ui.addButton("colorPicker", {
      text: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 21h18" />
        <path d="M14 3l7 7-6 6L8 9 14 3z" />
        <path d="M7.5 16.5l-1.5 1.5" />
      </svg>
`,
      tooltip: "BG Color",
      onAction: () => {
        const input = editor.toolbar.querySelector(
          "#soditor-bg-color-picker-label",
        ) as HTMLInputElement;
        if (input) {
          input.click();
        }
      },
    });

    const label = document.createElement("label");
    label.id = "soditor-bg-color-picker-label";
    label.style.marginLeft = "8px";
    label.style.display = "none";

    const input = document.createElement("input");
    input.type = "color";
    input.value = "#000000"; // default black
    input.style.marginLeft = "4px";
    input.style.visibility = "hidden";

    input.oninput = () => {
      const color = input.value;
      editor.exec((fragment) => {
        const span = document.createElement("span");
        span.style.backgroundColor = color;
        span.appendChild(fragment);
        return span;
      });
    };

    label.appendChild(input);
    editor.toolbar.appendChild(label);
  },
};
