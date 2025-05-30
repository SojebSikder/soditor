import type { EditorPlugin } from "./types";

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

  private undoStack: string[] = [];
  private redoStack: string[] = [];

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

    // Save state on input
    this.saveState();
    const debouncedSave = debounce(() => this.saveState(), 300);
    this.editor.addEventListener("input", debouncedSave);
  }

  private saveState(): void {
    this.undoStack.push(this.editor.innerHTML);
    // Clear redo stack on new input
    this.redoStack = [];
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
  }

  /**
   * Add a button to the toolbar
   * @param label - The label of the button
   * @param action - The action to perform when the button is clicked
   */
  addButton(label: string, action: () => void): void {
    const btn = document.createElement("button");
    btn.innerHTML = label;

    btn.setAttribute("aria-label", label);
    btn.classList.add("editor-btn");

    btn.onclick = action;
    this.toolbar.appendChild(btn);
  }
}

// --- Init ---
// const editor = new Editor('toolbar', 'editor');
// editor.use(boldPlugin);
// editor.use(italicPlugin);
// editor.use(imagePlugin);
