import { EditorEventEmitter } from "./editorEventEmitter";
import type {
  EditorButtonElementProps,
  EditorDropDownElementProps,
  EditorPlugin,
} from "./types";
import type {
  EditorEventName,
  EditorEventCallback,
} from "./editorEventEmitter";
import { getRegisteredPlugin } from "./pluginRegistry";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: number | null = null;
  return function (this: any, ...args: any[]) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => func.apply(this, args), delay);
  } as T;
}

/**
 * Editor class
 * @class Editor
 * @param toolbarId - The id of the toolbar
 * @param editorId - The id of the editor
 */
export class Editor {
  toolbar: HTMLElement;
  editor: HTMLElement;
  plugins: EditorPlugin[] = [];

  private maxHistory = 100;
  private undoStack: string[] = [];
  private redoStack: string[] = [];

  /**
   * Saved range for selection range
   */
  private savedRange: Range | null = null;

  private inputListener?: EventListener;

  private emitter = new EditorEventEmitter();

  /**
   * Constructor
   * @param toolbarId - The id of the toolbar
   * @param editorId - The id of the editor
   */
  constructor(toolbarId: string, editorId: string) {
    const toolbar = document.querySelector(toolbarId) as HTMLElement;
    const editor = document.querySelector(editorId) as HTMLElement;
    if (!toolbar || !editor) {
      throw new Error("Toolbar or Editor not found");
    }
    this.toolbar = toolbar;
    this.editor = editor;

    // Set attributes
    this.toolbar.setAttribute("role", "toolbar");
    this.editor.setAttribute("role", "textbox");
    this.editor.setAttribute("contenteditable", "true");

    // Save state on input
    const debouncedSave = debounce(() => {
      this.saveState();
      this.emitter.emit("input", { html: this.editor.innerHTML });
    }, 300);

    this.inputListener = debouncedSave;

    this.editor.addEventListener("input", debouncedSave);

    this.editor.addEventListener("mouseup", () => {
      this.emitter.emit("selectionchange", { range: this.getSelectionRange() });
    });

    this.editor.addEventListener("keyup", () => {
      this.emitter.emit("selectionchange", { range: this.getSelectionRange() });
    });

    // observe mutations
    const observer = new MutationObserver(() => {
      this.emitter.emit("change", { html: this.editor.innerHTML });
    });
    observer.observe(this.editor, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Auto load plugins
    const registered = getRegisteredPlugin();
    for (const [name, plugin] of Object.entries(registered)) {
      this.use(plugin);
    }
  }

  saveState(): void {
    if (this.undoStack.length >= this.maxHistory) {
      this.undoStack.shift(); // Remove oldest
    }
    this.undoStack.push(this.editor.innerHTML);
    // Clear redo stack on new input
    this.redoStack = [];

    this.emitter.emit("contentChange", { html: this.editor.innerHTML });
  }

  private saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0);
      // console.log("Selection saved!");
    } else {
      // console.log("No selection to save!");
    }
  }

  private restoreSelection() {
    if (this.savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.savedRange);
      // console.log("Selection restored!");
    } else {
      // console.log("No saved selection!");
    }
  }

  saveCurrentSelection() {
    this.saveSelection();
  }

  restoreSavedSelection() {
    this.restoreSelection();
  }

  // listen to editor events
  on<K extends EditorEventName>(
    event: K,
    callback: EditorEventCallback<K>
  ): void {
    this.emitter.on(event, callback);
  }

  // remove listener for editor events
  off<K extends EditorEventName>(
    event: K,
    callback: EditorEventCallback<K>
  ): void {
    this.emitter.off(event, callback);
  }

  /**
   * Undo the last action
   */
  undo(): void {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop()!;
      this.redoStack.push(currentState);
      const previousState = this.undoStack[this.undoStack.length - 1];
      this.editor.innerHTML = previousState;
    }
  }

  /**
   * Redo the last action
   */
  redo(): void {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()!;
      this.undoStack.push(nextState);
      this.editor.innerHTML = nextState;
    }
  }

  /**
   * Destroy the editor
   */
  destroy(): void {
    if (this.inputListener) {
      this.editor.removeEventListener("input", this.inputListener);
    }
    for (const plugin of this.plugins) {
      plugin.destroy?.(this);
      this.emitter.emit("pluginDestroy", {
        pluginName: plugin.constructor.name,
      });
    }
    this.plugins = [];
  }

  /**
   * Use a plugin
   * @param plugin - The plugin to use
   */
  use(plugin: EditorPlugin): void {
    plugin.init(this);
    this.plugins.push(plugin);
    this.emitter.emit("pluginInit", { pluginName: plugin.constructor.name });
  }

  /**
   * Get the selection range
   * @returns The selection range
   */
  getSelectionRange(): Range | null {
    const sel = window.getSelection();
    return sel?.rangeCount ? sel.getRangeAt(0) : null;
  }

  /**
   * Get the parent element of the current selection
   * @returns The parent element of the current selection
   */
  getParentElement(): Element | null {
    const sel = window.getSelection();

    // const parent = sel?.anchorNode?.parentElement;

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      return range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? (range.commonAncestorContainer as Element)
        : range.commonAncestorContainer.parentElement;
    }
    return null;
  }

  /**
   * Remove the parent element of the current selection
   * @param parent - The parent element to remove
   */
  removeParentElement(parent: Element): void {
    // Remove the strong by replacing it with its children
    const element = parent;
    const frag = document.createDocumentFragment();
    while (element.firstChild) {
      frag.appendChild(element.firstChild);
    }
    element.replaceWith(frag);
    return;
  }

  /**
   * Execute a function to format the selected text
   * @param formatFn - The function to format the selected text
   */
  exec(formatFn: (frag: DocumentFragment) => Node): void {
    // Save selection before changes
    this.saveSelection();

    const range = this.getSelectionRange();
    if (!range || range.collapsed) return;

    const fragment = range.extractContents();
    const node = formatFn(fragment);

    const wrapper = document.createDocumentFragment();
    wrapper.appendChild(node);
    range.insertNode(wrapper);

    range.setStartAfter(node);
    range.setEndAfter(node);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    // Save state after exec
    this.saveState();

    // restore selection after exec
    // this.restoreSelection();
    this.emitter.emit("execCommand", { command: formatFn.name || "unknown" });
  }

  // ------------------------- UI -------------------------
  /**
   * Add a tooltip to an element
   * @param element - The element to add the tooltip to
   * @param tooltipText - The text of the tooltip
   */
  addTooltip(element: HTMLElement, tooltipText: string): void {
    // tooltip
    element.classList.add("seditor-tooltip");
    const tooltip = document.createElement("div");
    tooltip.classList.add("seditor-tooltiptext");
    tooltip.innerHTML = tooltipText || "";
    element.appendChild(tooltip);
    // end tooltip
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
    btn.classList.add("seditor-btn");

    // btn.onclick = props.onAction;
    btn.onclick = () => {
      if (props.onAction) {
        props.onAction();
        this.saveState();
      }
    };
    this.toolbar.appendChild(btn);
  }

  addDropdown(name: string, props: EditorDropDownElementProps): void {
    const dropdown = document.createElement("div");
    dropdown.classList.add("seditor-dropdown");

    const button = document.createElement("button");
    button.innerHTML = props.text || name;
    button.setAttribute("aria-label", props.tooltip || "");
    button.classList.add("seditor-btn");
    // tooltip
    this.addTooltip(button, props.tooltip || "");

    const menu = document.createElement("div");
    menu.classList.add("seditor-dropdown-content");

    // Add options to the dropdown menu
    for (const opt of props.options || []) {
      const item = document.createElement("a");
      item.textContent = opt.label;
      item.onclick = () => {
        opt.onSelect(opt.value);
      };
      menu.appendChild(item);
    }

    // Toggle menu
    button.onclick = () => {
      menu.classList.toggle("seditor-show");
    };

    // Close the dropdown if clicked outside
    window.onclick = (event) => {
      if (!(event.target as HTMLElement).matches(".seditor-btn")) {
        const dropdowns = document.getElementsByClassName(
          "seditor-dropdown-content"
        );
        for (let i = 0; i < dropdowns.length; i++) {
          if (dropdowns[i].classList.contains("seditor-show")) {
            dropdowns[i].classList.remove("seditor-show");
          }
        }
      }
    };

    // Append button and menu to the dropdown
    dropdown.appendChild(button);
    dropdown.appendChild(menu);
    this.toolbar.appendChild(dropdown);
  }
  // ------------------------- End UI -------------------------

  // ------------------------- Content Management -------------------------
  toHTML(): string {
    return this.editor.innerHTML;
  }

  fromHTML(html: string): void {
    this.editor.innerHTML = html;
    this.saveState();
  }
}
