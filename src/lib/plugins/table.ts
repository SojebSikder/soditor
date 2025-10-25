import type { EditorPlugin } from "../editor/types";
import { Editor } from "../editor/editor";

export const tablePlugin: EditorPlugin = {
  name: "table",
  init(editor: Editor) {
    // --- Create Table Button ---
    editor.ui.addButton("table", {
      text: "📊 Table",
      tooltip: "Insert Table",
      onAction: () => {
        const rows = parseInt(prompt("Enter number of rows:", "2") || "2");
        const cols = parseInt(prompt("Enter number of columns:", "2") || "2");

        if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
          alert("Invalid size!");
          return;
        }

        insertTable(editor, rows, cols);
      },
    });

    // --- Quick Presets Dropdown ---
    editor.ui.addDropdown("tablePresets", {
      text: "Table Presets",
      tooltip: "Quick insert",
      options: [
        { label: "2 × 2", value: "2x2", onSelect: () => insertTable(editor, 2, 2) },
        { label: "3 × 3", value: "3x3", onSelect: () => insertTable(editor, 3, 3) },
        { label: "4 × 4", value: "4x4", onSelect: () => insertTable(editor, 4, 4) },
      ],
    });

    // --- Table Context Toolbar (Floating) ---
    const contextToolbar = createContextToolbar(editor);
    document.body.appendChild(contextToolbar);

    // Track selection to show/hide context toolbar
    editor.on("selectionchange", () => {
      const parent = editor.getParentElement();
      const cell = findClosestCell(parent);

      if (cell && cell instanceof HTMLTableCellElement) {
        const rect = cell.getBoundingClientRect();
        contextToolbar.style.display = "flex";
        contextToolbar.style.top = `${window.scrollY + rect.top - 40}px`;
        contextToolbar.style.left = `${window.scrollX + rect.left}px`;
        (contextToolbar as any).currentCell = cell;
      } else {
        contextToolbar.style.display = "none";
      }
    });
  },

  destroy(editor: Editor) {
    const toolbar = document.getElementById("editor-table-toolbar");
    if (toolbar) toolbar.remove();
  },
};

/**
 * Helper — Insert new table
 */
function insertTable(editor: Editor, rows: number, cols: number) {
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.margin = "8px 0";
  table.style.border = "1px solid #ccc";
  table.style.width = "100%";

  for (let i = 0; i < rows; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      const td = document.createElement("td");
      td.style.border = "1px solid #ccc";
      td.style.padding = "6px";
      td.style.minWidth = "40px";
      td.contentEditable = "true";
      td.innerHTML = "&nbsp;";
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  const range = editor.getSelectionRange();
  if (range) {
    range.insertNode(table);
    range.setStartAfter(table);
    range.collapse(true);

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  } else {
    editor.insertNode(table);
  }

  editor.saveState();
}

/**
 * Helper — Create floating context toolbar for table editing
 */
function createContextToolbar(editor: Editor): HTMLElement {
  const toolbar = document.createElement("div");
  toolbar.id = "editor-table-toolbar";
  toolbar.style.position = "absolute";
  toolbar.style.display = "none";
  toolbar.style.background = "#fff";
  toolbar.style.border = "1px solid #ccc";
  toolbar.style.borderRadius = "6px";
  toolbar.style.padding = "4px";
  toolbar.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
  toolbar.style.zIndex = "9999";
  toolbar.style.gap = "4px";

  const makeBtn = (label: string, title: string, handler: () => void) => {
    const btn = document.createElement("button");
    btn.innerHTML = label;
    btn.title = title;
    btn.style.border = "none";
    btn.style.background = "#f4f4f4";
    btn.style.cursor = "pointer";
    btn.style.padding = "4px 6px";
    btn.style.borderRadius = "4px";
    btn.onmouseenter = () => (btn.style.background = "#e0e0e0");
    btn.onmouseleave = () => (btn.style.background = "#f4f4f4");
    btn.onclick = handler;
    return btn;
  };

  toolbar.appendChild(makeBtn("➕ Row", "Add row below", () => {
    const cell = (toolbar as any).currentCell as HTMLTableCellElement;
    if (!cell) return;
    const row = cell.parentElement as HTMLTableRowElement;
    const table = row.parentElement as HTMLTableElement;
    const newRow = row.cloneNode(true) as HTMLTableRowElement;
    newRow.querySelectorAll("td").forEach((td) => (td.innerHTML = "&nbsp;"));
    table.insertBefore(newRow, row.nextSibling);
    editor.saveState();
  }));

  toolbar.appendChild(makeBtn("➖ Row", "Delete this row", () => {
    const cell = (toolbar as any).currentCell as HTMLTableCellElement;
    if (!cell) return;
    const row = cell.parentElement as HTMLTableRowElement;
    row.remove();
    editor.saveState();
  }));

  toolbar.appendChild(makeBtn("➕ Col", "Add column", () => {
    const cell = (toolbar as any).currentCell as HTMLTableCellElement;
    if (!cell) return;
    const colIndex = Array.from(cell.parentElement!.children).indexOf(cell);
    const table = cell.closest("table") as HTMLTableElement;
    table.querySelectorAll("tr").forEach((tr) => {
      const newTd = document.createElement("td");
      newTd.style.border = "1px solid #ccc";
      newTd.style.padding = "6px";
      newTd.style.minWidth = "40px";
      newTd.contentEditable = "true";
      newTd.innerHTML = "&nbsp;";
      tr.insertBefore(newTd, tr.children[colIndex + 1] || null);
    });
    editor.saveState();
  }));

  toolbar.appendChild(makeBtn("➖ Col", "Delete this column", () => {
    const cell = (toolbar as any).currentCell as HTMLTableCellElement;
    if (!cell) return;
    const colIndex = Array.from(cell.parentElement!.children).indexOf(cell);
    const table = cell.closest("table") as HTMLTableElement;
    table.querySelectorAll("tr").forEach((tr) => {
      if (tr.children[colIndex]) tr.children[colIndex].remove();
    });
    editor.saveState();
  }));

  toolbar.appendChild(makeBtn("🗑️", "Delete entire table", () => {
    const cell = (toolbar as any).currentCell as HTMLTableCellElement;
    const table = cell?.closest("table");
    if (table) {
      table.remove();
      toolbar.style.display = "none";
      editor.saveState();
    }
  }));

  return toolbar;
}

/**
 * Find the nearest <td> or <th> element up the tree
 */
function findClosestCell(node: Element | null): HTMLTableCellElement | null {
  while (node) {
    if (node instanceof HTMLTableCellElement) return node;
    node = node.parentElement;
  }
  return null;
}
