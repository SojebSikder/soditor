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

    const select = document.createElement("select");
    select.setAttribute("aria-label", "Font selector");
    select.classList.add("editor-font-select");

    fonts.forEach((font) => {
      const option = document.createElement("option");
      option.value = font;
      option.innerText = font;
      select.appendChild(option);
    });

    select.onchange = () => {
      const selectedFont = select.value;
      editor.exec((fragment) => {
        const span = document.createElement("span");
        span.style.fontFamily = selectedFont;
        span.appendChild(fragment);
        return span;
      });
    };

    editor.toolbar.appendChild(select);
  },
};
