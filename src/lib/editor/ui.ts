import { Editor } from "./editor";
import { EditorButtonElementProps, EditorDropDownElementProps } from "./types";

interface ModalButton {
  text: string;
  primary?: boolean;
  onClick: (api: { closeModal: () => void }) => void;
}
interface ModalProps {
  id: string;
  title: string;
  content: string;
  buttons?: ModalButton[];
}

export class UI {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  /**
   * Add a tooltip to an element
   * @param element - The element to add the tooltip to
   * @param tooltipText - The text of the tooltip
   */
  addTooltip(element: HTMLElement, tooltipText: string): void {
    element.classList.add("soditor-tooltip");
    const tooltip = document.createElement("div");
    tooltip.classList.add("soditor-tooltiptext");
    tooltip.innerHTML = tooltipText || "";
    element.appendChild(tooltip);
  }

  /**
   * Add a button to the toolbar
   * @param label - The label of the button
   * @param action - The action to perform when the button is clicked
   */
  addButton(name: string, props: EditorButtonElementProps): void {
    const btn = document.createElement("button");
    btn.name = name;
    btn.innerHTML = props.text || "";

    // tooltip
    this.addTooltip(btn, props.tooltip || "");

    btn.setAttribute("aria-label", props.tooltip || "");
    btn.classList.add("soditor-btn");

    // btn.onclick = props.onAction;
    btn.onclick = () => {
      if (props.onAction) {
        props.onAction();
        this.editor.saveState();
      }
    };
    this.editor.toolbar.appendChild(btn);
  }

  addDropdown(name: string, props: EditorDropDownElementProps): void {
    const dropdown = document.createElement("div");
    dropdown.classList.add("soditor-dropdown");

    const button = document.createElement("button");
    button.innerHTML = props.text || name;
    button.setAttribute("aria-label", props.tooltip || "");
    button.classList.add("soditor-btn");
    // tooltip
    this.addTooltip(button, props.tooltip || "");

    const menu = document.createElement("div");
    menu.classList.add("soditor-dropdown-content");

    // Add options to the dropdown menu
    for (const opt of props.options || []) {
      const item = document.createElement("a");
      item.textContent = opt.label;
      item.onclick = () => {
        if (opt.onSelect) {
          this.editor.restoreSelection();
          opt.onSelect(opt.value);
          this.editor.saveSelection();
        }
      };
      menu.appendChild(item);
    }

    // Toggle menu
    button.onclick = () => {
      this.editor.saveSelection();
      menu.classList.toggle("soditor-show");
    };

    // Close the dropdown if clicked outside
    window.onclick = (event) => {
      if (!(event.target as HTMLElement).matches(".soditor-btn")) {
        const dropdowns = document.getElementsByClassName(
          "soditor-dropdown-content"
        );
        for (let i = 0; i < dropdowns.length; i++) {
          if (dropdowns[i].classList.contains("soditor-show")) {
            dropdowns[i].classList.remove("soditor-show");
          }
        }
      }
    };

    // Append button and menu to the dropdown
    dropdown.appendChild(button);
    dropdown.appendChild(menu);
    this.editor.toolbar.appendChild(dropdown);
  }

  /**
   * Add a modal dialog to the DOM
   * @param id - The ID of the modal for future reference
   * @param title - The modal title
   * @param content - The HTML content inside the modal body
   * @param onConfirm - Function to call when the confirm button is clicked
   */
  addModal({ id, title, content, buttons }: ModalProps): void {
    const modal = document.createElement("div");
    modal.id = id;
    modal.classList.add("soditor-modal");

    modal.innerHTML = `
    <div class="soditor-modal-content">
      <span class="soditor-close">&times;</span>
      <h2 class="soditor-modal-title">${title}</h2>
      <div class="soditor-modal-body">${content}</div>
      <div class="soditor-modal-footer">
      ${
        buttons
          ? buttons
              .map(
                (btn) =>
                  `<button class="soditor-btn ${
                    btn.primary ? "soditor-btn-primary" : ""
                  }">${btn.text}</button>`
              )
              .join("")
          : ""
      }
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    const closeModal = () => {
      modal.style.display = "none";
    };

    modal
      .querySelector(".soditor-close")
      ?.addEventListener("click", closeModal);
    modal
      .querySelector(".soditor-modal-cancel")
      ?.addEventListener("click", closeModal);
    modal
      .querySelector(".soditor-modal-confirm")
      ?.addEventListener("click", () => {
        closeModal();
      });

    // Attach click handlers to footer buttons
    const footerButtons = modal.querySelectorAll(
      ".soditor-modal-footer button"
    );
    footerButtons.forEach((btn, index) => {
      if (buttons && buttons[index]) {
        btn.addEventListener("click", () => {
          const api = {
            closeModal: () => closeModal(),
          };
          buttons[index].onClick(api);
        });
      }
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
    // Close modal on Escape key
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    });
  }

  /**
   * Show the modal by ID
   */
  showModal(id: string): void {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
  }

  closeModal(id: string): void {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
  }
}
