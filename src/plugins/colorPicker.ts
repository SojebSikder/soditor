import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

/**
 * Text color plugin
 */
export const colorPickerPlugin: EditorPlugin = {
  name: "colorPicker",
  init(editor: Editor) {
    const label = document.createElement("label");
    label.style.marginLeft = "8px";
    label.innerText = "Text Color: ";

    const input = document.createElement("input");
    input.type = "color";
    input.value = "#000000"; // default black
    input.style.marginLeft = "4px";

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
