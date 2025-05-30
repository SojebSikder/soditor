import type { EditorElementProps, EditorPlugin } from "./types";

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
    this.saveState();
    const debouncedSave = debounce(() => this.saveState(), 300);
    this.inputListener = debouncedSave;
    this.editor.addEventListener("input", debouncedSave);
  }

  private saveState(): void {
    if (this.undoStack.length >= this.maxHistory) {
      this.undoStack.shift(); // Remove oldest
    }
    this.undoStack.push(this.editor.innerHTML);
    // Clear redo stack on new input
    this.redoStack = [];
  }

  private saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0);
      console.log("Selection saved!");
    } else {
      console.log("No selection to save!");
    }
  }

  private restoreSelection() {
    if (this.savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.savedRange);
      console.log("Selection restored!");
    } else {
      console.log("No saved selection!");
    }
  }

  saveCurrentSelection() {
    this.saveSelection();
  }

  restoreSavedSelection() {
    this.restoreSelection();
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

    // Optionally restore selection after exec, if needed
    this.restoreSelection();
  }

  /**
   * Add a button to the toolbar
   * @param label - The label of the button
   * @param action - The action to perform when the button is clicked
   */
  // addButton(label: string, action: () => void): void {
  //   const btn = document.createElement("button");
  //   btn.innerHTML = label;

  //   btn.setAttribute("aria-label", label);
  //   btn.classList.add("editor-btn");

  //   btn.onclick = action;
  //   this.toolbar.appendChild(btn);
  // }
  addButton(name: string, props: EditorElementProps): void {
    const btn = document.createElement("button");
    btn.name = name;
    btn.innerHTML = props.text || "";

    // tooltip
    btn.classList.add("tooltip");
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltiptext");
    tooltip.innerHTML = props.tooltip || "";
    btn.appendChild(tooltip);

    // add tooltip to btn
    btn.appendChild(tooltip);

    btn.setAttribute("aria-label", props.tooltip || "");
    btn.classList.add("editor-btn");

    btn.onclick = props.onAction;
    this.toolbar.appendChild(btn);
  }

  toHTML(): string {
    return this.editor.innerHTML;
  }

  fromHTML(html: string): void {
    this.editor.innerHTML = html;
    this.saveState();
  }
}
