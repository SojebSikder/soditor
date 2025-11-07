import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

/**
 * Text color plugin
 */
export const colorPickerPlugin: EditorPlugin = {
  name: "colorPicker",
  init(editor: Editor) {
    editor.ui.addButton("colorPicker", {
      text: `<svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Color">
  <!-- Pencil tip / color drop -->
  <path d="M12 19l7-7-4-4-7 7v4h4z" />
  <!-- Optional color square / palette -->
  <rect x="2" y="20" width="4" height="4" rx="1" ry="1" />
</svg>
`,
      tooltip: "Text Color",
      onAction: () => {
        const input = editor.toolbar.querySelector("#soditor-color-picker-label") as HTMLInputElement;
        if (input) {
          input.click();
        }
      },
    });

    const label = document.createElement("label");
    label.id = "soditor-color-picker-label";
    label.style.marginLeft = "8px";

    const input = document.createElement("input");
    input.type = "color";
    input.value = "#000000"; // default black
    input.style.marginLeft = "4px";
    input.style.visibility = "hidden";

    input.oninput = () => {
      const color = input.value;
      editor.exec((fragment) => {
        const span = document.createElement("span");
        span.style.color = color;
        span.appendChild(fragment);
        return span;
      });
    };

    label.appendChild(input);
    editor.toolbar.appendChild(label);
  },
};
