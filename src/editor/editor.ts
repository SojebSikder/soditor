import type { EditorPlugin } from "./types";

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
    range.insertNode(node);

    range.setStartAfter(node);
    range.setEndAfter(node);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  /**
   * Add a button to the toolbar
   * @param label - The label of the button
   * @param action - The action to perform when the button is clicked
   */
  addButton(label: string, action: () => void): void {
    const btn = document.createElement("button");
    btn.innerHTML = label;
    btn.onclick = action;
    this.toolbar.appendChild(btn);
  }
}

// --- Init ---
// const editor = new Editor('toolbar', 'editor');
// editor.use(boldPlugin);
// editor.use(italicPlugin);
// editor.use(imagePlugin);
