import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const linkPlugin: EditorPlugin = {
  name: "link",
  init(editor: Editor) {
    editor.ui.addButton("myButton", {
      text: "Insert Link",
      onAction: () => {
        editor.saveSelection();
        editor.ui.showModal("insertLinkModal");

        const modal = document.getElementById("insertLinkModal");
        if (!modal) return;

        const textInput = modal.querySelector(
          "#modal-link-text"
        ) as HTMLInputElement;

        let selectedText = "";
        if (editor.savedRange) {
          selectedText = editor.savedRange.toString();
        }

        if (textInput) {
          textInput.value = selectedText;
          textInput.focus();
        }

        // Optionally clear URL input
        const urlInput = modal.querySelector(
          "#modal-link-url"
        ) as HTMLInputElement;
        if (urlInput) {
          urlInput.value = "";
        }
      },
      tooltip: "Insert a link",
    });

    editor.ui.addModal({
      id: "insertLinkModal",
      title: "Insert Link",
      content: `
    <label>URL: <input type="text" id="modal-link-url" autofocus /></label>
    <br />
    <br />
    <label>Text: <input type="text" id="modal-link-text" /></label>
  `,
      buttons: [
        {
          text: "Cancel",
          onClick: (api) => {
            api.closeModal();
          },
        },
        {
          text: "Insert",
          primary: true,
          onClick: (api) => {
            const urlInput = document.getElementById(
              "modal-link-url"
            ) as HTMLInputElement;
            const url = urlInput.value.trim();

            if (url) {
              const textInput = document.getElementById(
                "modal-link-text"
              ) as HTMLInputElement;
              const text = textInput.value.trim() || url;

              editor.restoreSelection();

              const range = editor.getSelectionRange();
              if (!range) return api.closeModal();

              const parent = editor.getParentElement();
              if (parent?.tagName === "A") {
                editor.removeParentElement(parent);
                return api.closeModal();
              }

              editor.exec((frag) => {
                const el = document.createElement("a");
                el.href = url;
                el.target = "_blank";
                el.rel = "noopener noreferrer";

                if (frag.childNodes.length === 0) {
                  el.textContent = text;
                } else {
                  el.appendChild(frag);
                }

                return el;
              });
            }
            api.closeModal();
          },
        },
      ],
    });
  },

  destroy(editor: Editor) {
    // Optional: remove button or clean up
    // editor.toolbar.removeChild(editor.toolbar.querySelector("button") as HTMLElement);
  },
};
