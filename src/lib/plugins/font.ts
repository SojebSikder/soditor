import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const fontPlugin: EditorPlugin = {
  name: "font",
  init(editor: Editor) {
    const fonts = [
      "Arial",
      "Courier New",
      "Georgia",
      "Times New Roman",
      "Verdana",
      "Comic Sans MS",
      "Impact",
      "Lucida Sans Unicode",
      "Tahoma",
      "Trebuchet MS",
    ];

    editor.ui.addDropdown("fonts", {
      text: `
      <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     role="img" aria-label="Font">
  <!-- Letter A -->
  <path d="M4 20h4l4-12h4" />
  <line x1="7" y1="16" x2="11" y2="16" />
</svg>

      `,
      tooltip: "Font",
      options: fonts.map((font) => {
        return {
          label: font,
          value: font,
          onSelect: (value) => {
            const selectedFont = value;

            const parent = editor.getParentElement();
            if (parent && parent instanceof HTMLSpanElement) {
              parent.style.fontFamily = selectedFont;
              return;
            }

            editor.exec((frag) => {
              const span = document.createElement("span");
              span.style.fontFamily = selectedFont;
              span.appendChild(frag);
              return span;
            });
          },
        };
      }),
    });
  },
};
