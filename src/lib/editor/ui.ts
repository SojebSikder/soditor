import { Editor } from "./editor";
import { EditorButtonElementProps, EditorDropDownElementProps } from "./types";
import { Utils } from "./utils";

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
   * Show a simple alert dialog
   * @param message - The message to display
   * @param title - Optional title (default: "Alert")
   */
  alert(message: string, title = "Alert"): void {
    const id = Utils.generateId("soditor-alert-modal");
    // Remove existing modal if any
    document.getElementById(id)?.remove();

    this.addModal({
      id,
      title,
      content: `<p>${message}</p>`,
      buttons: [
        {
          text: "OK",
          primary: true,
          onClick: ({ closeModal }) => closeModal(),
        },
      ],
    });

    this.showModal(id);
  }

  /**
   * Show a prompt dialog that returns user input
   * @param message - The label or question
   * @param defaultValue - Optional default input value
   * @param title - Optional title (default: "Prompt")
   * @param callback - Called with user input or null if canceled
   */
  prompt(
    message: string,
    defaultValue = "",
    title = "Prompt",
    callback: (value: string | null) => void
  ): void {
    const id = Utils.generateId("soditor-prompt-modal");
    // Remove existing modal if any
    document.getElementById(id)?.remove();

    this.addModal({
      id,
      title,
      content: `
      <label class="soditor-label">${message}</label>
      <input type="text" class="soditor-input" value="${defaultValue}" style="width:100%;margin-top:8px;padding:6px;" />
    `,
      buttons: [
        {
          text: "Cancel",
          onClick: ({ closeModal }) => {
            closeModal();
            callback(null);
          },
        },
        {
          text: "OK",
          primary: true,
          onClick: ({ closeModal }) => {
            const input = document.querySelector<HTMLInputElement>(
              "#soditor-prompt-modal input"
            );
            const value = input?.value ?? "";
            closeModal();
            callback(value);
          },
        },
      ],
    });

    this.showModal(id);

    // Focus input automatically
    setTimeout(() => {
      document
        .querySelector<HTMLInputElement>("#soditor-prompt-modal input")
        ?.focus();
    }, 50);
  }

  confirm(
    message: string,
    title = "Confirm",
    callback: (ok: boolean) => void
  ): void {
    const id = Utils.generateId("soditor-confirm-modal");

    this.addModal({
      id,
      title,
      content: `<p>${message}</p>`,
      buttons: [
        {
          text: "Cancel",
          onClick: ({ closeModal }) => {
            closeModal();
            callback(false);
          },
        },
        {
          text: "OK",
          primary: true,
          onClick: ({ closeModal }) => {
            closeModal();
            callback(true);
          },
        },
      ],
    });

    this.showModal(id);
  }

  showToast(
    message: string,
    type: "info" | "success" | "error" = "info",
    duration = 3000
  ): void {
    const containerId = "soditor-toast-container";
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.classList.add("soditor-toast-container");
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.classList.add("soditor-toast", `soditor-toast-${type}`);
    toast.innerText = message;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 50);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, duration);
  }

  showLoader(message = "Loading..."): void {
    const id = "soditor-loader";
    if (document.getElementById(id)) return;

    const loader = document.createElement("div");
    loader.id = id;
    loader.classList.add("soditor-loader-overlay");
    loader.innerHTML = `
    <div class="soditor-loader-spinner"></div>
    <p>${message}</p>
  `;
    document.body.appendChild(loader);
  }

  hideLoader(): void {
    document.getElementById("soditor-loader")?.remove();
  }

  showSnackbar(message: string, duration = 2500): void {
    const snackbar = document.createElement("div");
    snackbar.className = "soditor-snackbar";
    snackbar.innerText = message;
    document.body.appendChild(snackbar);

    setTimeout(() => snackbar.classList.add("show"), 50);

    setTimeout(() => {
      snackbar.classList.remove("show");
      setTimeout(() => snackbar.remove(), 400);
    }, duration);
  }

  addFloatingToolbar(
    buttons: { icon: string; tooltip: string; onClick: () => void }[]
  ): void {
    const toolbar = document.createElement("div");
    toolbar.classList.add("soditor-floating-toolbar");

    buttons.forEach(({ icon, tooltip, onClick }) => {
      const btn = document.createElement("button");
      btn.classList.add("soditor-btn");
      btn.innerHTML = icon;
      this.addTooltip(btn, tooltip);
      btn.onclick = onClick;
      toolbar.appendChild(btn);
    });

    document.body.appendChild(toolbar);
  }

  /**
   * Create a reusable floating context toolbar.
   * You can dynamically show it anywhere with custom buttons.
   */
  createContextToolbar(): {
    element: HTMLElement;
    show: (options: {
      x: number;
      y: number;
      buttons: { icon: string; title: string; onClick: () => void }[];
      context?: any;
    }) => void;
    hide: () => void;
  } {
    const toolbar = document.createElement("div");
    toolbar.id = "soditor-context-toolbar";
    toolbar.classList.add("soditor-context-toolbar");

    Object.assign(toolbar.style, {
      position: "absolute",
      display: "none",
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: "6px",
      padding: "4px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      zIndex: "9999",
      gap: "4px",
      // display: "flex",
      alignItems: "center",
    });

    const makeBtn = (icon: string, title: string, handler: () => void) => {
      const btn = document.createElement("button");
      btn.innerHTML = icon;
      btn.title = title;
      btn.classList.add("soditor-btn");
      Object.assign(btn.style, {
        border: "none",
        background: "#f4f4f4",
        cursor: "pointer",
        padding: "4px 6px",
        borderRadius: "4px",
      });
      btn.onmouseenter = () => (btn.style.background = "#e0e0e0");
      btn.onmouseleave = () => (btn.style.background = "#f4f4f4");
      btn.onclick = handler;
      return btn;
    };

    document.body.appendChild(toolbar);

    // Hide when clicking outside
    document.addEventListener("click", (e) => {
      if (!toolbar.contains(e.target as Node)) {
        toolbar.style.display = "none";
      }
    });

    return {
      element: toolbar,

      /**
       * Show the toolbar at given position with given buttons
       */
      show: ({ x, y, buttons, context }) => {
        toolbar.innerHTML = ""; // reset previous content

        (toolbar as any).context = context; // store custom context
        buttons.forEach(({ icon, title, onClick }) => {
          toolbar.appendChild(
            makeBtn(icon, title, () => {
              onClick();
            })
          );
        });

        toolbar.style.left = `${x}px`;
        toolbar.style.top = `${y}px`;
        toolbar.style.display = "flex";
      },

      /**
       * Hide the toolbar
       */
      hide: () => {
        toolbar.style.display = "none";
      },
    };
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
