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

    editor.addDropdown("fonts", {
      text: "Font",
      tooltip: "Font",
      options: fonts.map((font) => {
        return {
          label: font,
          value: font,
          onSelect: (value) => {
            const selectedFont = value;
            console.log(selectedFont);

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
