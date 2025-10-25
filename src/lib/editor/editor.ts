import { EditorEventEmitter } from "./editorEventEmitter";
import type { EditorPlugin } from "./types";
import type {
  EditorEventName,
  EditorEventCallback,
} from "./editorEventEmitter";
import { getRegisteredPlugin } from "./pluginRegistry";
import { UI } from "./ui";
import { Utils } from "./utils";

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

  public ui: UI;

  private maxHistory = 100;
  private undoStack: string[] = [];
  private redoStack: string[] = [];

  private commands: Map<string, (...args: any[]) => void> = new Map();

  /**
   * Saved range for selection range
   */
  public savedRange: Range | null = null;

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
    const debouncedSave = Utils.debounce(() => {
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

    // Initialize UI
    this.ui = new UI(this);

    // preload built-in commands
    this.registerCommand("undo", () => this.undo());
    this.registerCommand("redo", () => this.redo());
  }

  /**
   * Register a new editor command
   */
  registerCommand(name: string, handler: (...args: any[]) => void): void {
    this.commands.set(name, handler);
    this.emitter.emit("commandRegistered", { name });
  }

  /**
   * Execute a registered command
   */
  execCommand(name: string, ...args: any[]): void {
    const handler = this.commands.get(name);
    if (!handler) {
      console.warn(`Command "${name}" not found`);
      return;
    }

    this.saveSelection(); // Save before exec
    handler(...args);
    this.saveState(); // Save after exec
    this.emitter.emit("execCommand", { command: name });
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

  public saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0);
      // console.log("Selection saved!");
    } else {
      // console.log("No selection to save!");
    }
  }

  public restoreSelection() {
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
    const frag = document.createDocumentFragment();
    const firstChild = parent.firstChild;
    const lastChild = parent.lastChild;

    // Move all children out of the element
    while (parent.firstChild) {
      frag.appendChild(parent.firstChild);
    }

    // Replace the element with its children
    parent.replaceWith(frag);

    // Restore selection around unwrapped text
    if (firstChild && lastChild) {
      const newRange = document.createRange();
      newRange.setStartBefore(firstChild);
      newRange.setEndAfter(lastChild);

      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(newRange);
      }

      // Save it for later
      this.savedRange = newRange.cloneRange();
    }
  }

  /**
   * Insert a node into the editor
   * @param node - The node to insert
   */
  insertNode(node: Node): void {
    this.editor.appendChild(node);
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

    // Detect block vs inline element
    const computedStyle = window.getComputedStyle(node as Element);
    const isBlock =
      computedStyle.display === "block" ||
      /^(DIV|P|H[1-6]|SECTION|ARTICLE|BLOCKQUOTE|UL|OL|LI)$/i.test(
        (node as Element).tagName
      );

    // Create a new range for selection
    const newRange = document.createRange();

    if (isBlock) {
      // For block elements → move caret after the element
      newRange.setStartAfter(node);
      newRange.collapse(true);
    } else {
      // For inline elements → reselect the formatted content
      newRange.selectNodeContents(node);
    }

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(newRange);
    }

    // Save range for next operation
    this.savedRange = newRange.cloneRange();

    // Save state after formatting
    this.saveState();

    this.emitter.emit("execCommand", { command: formatFn.name || "unknown" });
  }

  // ------------------------- Content Management -------------------------
  insertContent(content: string): void {
    this.saveSelection();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    const range = this.getSelectionRange();
    if (range && !range.collapsed) {
      range.deleteContents();

      // Insert all children of tempDiv at the range
      const frag = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        frag.appendChild(tempDiv.firstChild);
      }
      range.insertNode(frag);

      // Move cursor to the end of inserted content
      range.collapse(false);

      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } else {
      // If no selection or collapsed, just append the content nodes
      while (tempDiv.firstChild) {
        this.editor.appendChild(tempDiv.firstChild);
      }
    }

    this.saveState();
  }

  toHTML(): string {
    return this.editor.innerHTML;
  }

  fromHTML(html: string): void {
    this.editor.innerHTML = html;
    this.saveState();
  }
}
