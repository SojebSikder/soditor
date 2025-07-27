var f = Object.defineProperty;
var S = (i, t, e) => t in i ? f(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var r = (i, t, e) => S(i, typeof t != "symbol" ? t + "" : t, e);
class v {
  constructor() {
    r(this, "listeners", {});
  }
  on(t, e) {
    this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(e);
  }
  off(t, e) {
    var n;
    this.listeners[t] = (n = this.listeners[t]) == null ? void 0 : n.filter(
      (o) => o !== e
    );
  }
  emit(t, e) {
    var n;
    (n = this.listeners[t]) == null || n.forEach((o) => o(e));
  }
}
const p = {};
function C(i, t) {
  p[i] = t;
}
function E() {
  return p;
}
class b {
  constructor(t) {
    r(this, "editor");
    this.editor = t;
  }
  /**
   * Add a tooltip to an element
   * @param element - The element to add the tooltip to
   * @param tooltipText - The text of the tooltip
   */
  addTooltip(t, e) {
    t.classList.add("soditor-tooltip");
    const n = document.createElement("div");
    n.classList.add("soditor-tooltiptext"), n.innerHTML = e || "", t.appendChild(n);
  }
  /**
   * Add a button to the toolbar
   * @param label - The label of the button
   * @param action - The action to perform when the button is clicked
   */
  addButton(t, e) {
    const n = document.createElement("button");
    n.name = t, n.innerHTML = e.text || "", this.addTooltip(n, e.tooltip || ""), n.setAttribute("aria-label", e.tooltip || ""), n.classList.add("soditor-btn"), n.onclick = () => {
      e.onAction && (e.onAction(), this.editor.saveState());
    }, this.editor.toolbar.appendChild(n);
  }
  addDropdown(t, e) {
    const n = document.createElement("div");
    n.classList.add("soditor-dropdown");
    const o = document.createElement("button");
    o.innerHTML = e.text || t, o.setAttribute("aria-label", e.tooltip || ""), o.classList.add("soditor-btn"), this.addTooltip(o, e.tooltip || "");
    const l = document.createElement("div");
    l.classList.add("soditor-dropdown-content");
    for (const s of e.options || []) {
      const a = document.createElement("a");
      a.textContent = s.label, a.onclick = () => {
        s.onSelect && (this.editor.restoreSelection(), s.onSelect(s.value), this.editor.saveSelection());
      }, l.appendChild(a);
    }
    o.onclick = () => {
      this.editor.saveSelection(), l.classList.toggle("soditor-show");
    }, window.onclick = (s) => {
      if (!s.target.matches(".soditor-btn")) {
        const a = document.getElementsByClassName(
          "soditor-dropdown-content"
        );
        for (let c = 0; c < a.length; c++)
          a[c].classList.contains("soditor-show") && a[c].classList.remove("soditor-show");
      }
    }, n.appendChild(o), n.appendChild(l), this.editor.toolbar.appendChild(n);
  }
  /**
   * Add a modal dialog to the DOM
   * @param id - The ID of the modal for future reference
   * @param title - The modal title
   * @param content - The HTML content inside the modal body
   * @param onConfirm - Function to call when the confirm button is clicked
   */
  addModal({ id: t, title: e, content: n, buttons: o }) {
    var c, d, m;
    const l = document.createElement("div");
    l.id = t, l.classList.add("soditor-modal"), l.innerHTML = `
    <div class="soditor-modal-content">
      <span class="soditor-close">&times;</span>
      <h2 class="soditor-modal-title">${e}</h2>
      <div class="soditor-modal-body">${n}</div>
      <div class="soditor-modal-footer">
      ${o ? o.map(
      (u) => `<button class="soditor-btn ${u.primary ? "soditor-btn-primary" : ""}">${u.text}</button>`
    ).join("") : ""}
      </div>
    </div>
  `, document.body.appendChild(l);
    const s = () => {
      l.style.display = "none";
    };
    (c = l.querySelector(".soditor-close")) == null || c.addEventListener("click", s), (d = l.querySelector(".soditor-modal-cancel")) == null || d.addEventListener("click", s), (m = l.querySelector(".soditor-modal-confirm")) == null || m.addEventListener("click", () => {
      s();
    }), l.querySelectorAll(
      ".soditor-modal-footer button"
    ).forEach((u, h) => {
      o && o[h] && u.addEventListener("click", () => {
        const g = {
          closeModal: () => s()
        };
        o[h].onClick(g);
      });
    }), window.addEventListener("click", (u) => {
      u.target === l && s();
    }), window.addEventListener("keydown", (u) => {
      u.key === "Escape" && s();
    });
  }
  /**
   * Show the modal by ID
   */
  showModal(t) {
    const e = document.getElementById(t);
    e && (e.style.display = "block");
  }
  closeModal(t) {
    const e = document.getElementById(t);
    e && (e.style.display = "none");
  }
}
function x(i, t) {
  let e = null;
  return function(...n) {
    e !== null && clearTimeout(e), e = window.setTimeout(() => i.apply(this, n), t);
  };
}
class L {
  /**
   * Constructor
   * @param toolbarId - The id of the toolbar
   * @param editorId - The id of the editor
   */
  constructor(t, e) {
    r(this, "toolbar");
    r(this, "editor");
    r(this, "plugins", []);
    r(this, "ui");
    r(this, "maxHistory", 100);
    r(this, "undoStack", []);
    r(this, "redoStack", []);
    /**
     * Saved range for selection range
     */
    r(this, "savedRange", null);
    r(this, "inputListener");
    r(this, "emitter", new v());
    const n = document.querySelector(t), o = document.querySelector(e);
    if (!n || !o)
      throw new Error("Toolbar or Editor not found");
    this.toolbar = n, this.editor = o, this.toolbar.setAttribute("role", "toolbar"), this.editor.setAttribute("role", "textbox"), this.editor.setAttribute("contenteditable", "true");
    const l = x(() => {
      this.saveState(), this.emitter.emit("input", { html: this.editor.innerHTML });
    }, 300);
    this.inputListener = l, this.editor.addEventListener("input", l), this.editor.addEventListener("mouseup", () => {
      this.emitter.emit("selectionchange", { range: this.getSelectionRange() });
    }), this.editor.addEventListener("keyup", () => {
      this.emitter.emit("selectionchange", { range: this.getSelectionRange() });
    }), new MutationObserver(() => {
      this.emitter.emit("change", { html: this.editor.innerHTML });
    }).observe(this.editor, {
      childList: !0,
      subtree: !0,
      characterData: !0
    });
    const a = E();
    for (const [c, d] of Object.entries(a))
      this.use(d);
    this.ui = new b(this);
  }
  saveState() {
    this.undoStack.length >= this.maxHistory && this.undoStack.shift(), this.undoStack.push(this.editor.innerHTML), this.redoStack = [], this.emitter.emit("contentChange", { html: this.editor.innerHTML });
  }
  saveSelection() {
    const t = window.getSelection();
    t.rangeCount > 0 && (this.savedRange = t.getRangeAt(0));
  }
  restoreSelection() {
    if (this.savedRange) {
      const t = window.getSelection();
      t.removeAllRanges(), t.addRange(this.savedRange);
    }
  }
  saveCurrentSelection() {
    this.saveSelection();
  }
  restoreSavedSelection() {
    this.restoreSelection();
  }
  // listen to editor events
  on(t, e) {
    this.emitter.on(t, e);
  }
  // remove listener for editor events
  off(t, e) {
    this.emitter.off(t, e);
  }
  /**
   * Undo the last action
   */
  undo() {
    if (this.undoStack.length > 1) {
      const t = this.undoStack.pop();
      this.redoStack.push(t);
      const e = this.undoStack[this.undoStack.length - 1];
      this.editor.innerHTML = e;
    }
  }
  /**
   * Redo the last action
   */
  redo() {
    if (this.redoStack.length > 0) {
      const t = this.redoStack.pop();
      this.undoStack.push(t), this.editor.innerHTML = t;
    }
  }
  /**
   * Destroy the editor
   */
  destroy() {
    var t;
    this.inputListener && this.editor.removeEventListener("input", this.inputListener);
    for (const e of this.plugins)
      (t = e.destroy) == null || t.call(e, this), this.emitter.emit("pluginDestroy", {
        pluginName: e.constructor.name
      });
    this.plugins = [];
  }
  /**
   * Use a plugin
   * @param plugin - The plugin to use
   */
  use(t) {
    t.init(this), this.plugins.push(t), this.emitter.emit("pluginInit", { pluginName: t.constructor.name });
  }
  /**
   * Get the selection range
   * @returns The selection range
   */
  getSelectionRange() {
    const t = window.getSelection();
    return t != null && t.rangeCount ? t.getRangeAt(0) : null;
  }
  /**
   * Get the parent element of the current selection
   * @returns The parent element of the current selection
   */
  getParentElement() {
    const t = window.getSelection();
    if (t && t.rangeCount > 0) {
      const e = t.getRangeAt(0);
      return e.commonAncestorContainer.nodeType === Node.ELEMENT_NODE ? e.commonAncestorContainer : e.commonAncestorContainer.parentElement;
    }
    return null;
  }
  /**
   * Remove the parent element of the current selection
   * @param parent - The parent element to remove
   */
  removeParentElement(t) {
    const e = t, n = document.createDocumentFragment();
    for (; e.firstChild; )
      n.appendChild(e.firstChild);
    e.replaceWith(n);
  }
  /**
   * Insert a node into the editor
   * @param node - The node to insert
   */
  insertNode(t) {
    this.editor.appendChild(t);
  }
  /**
   * Execute a function to format the selected text
   * @param formatFn - The function to format the selected text
   */
  exec(t) {
    this.saveSelection();
    const e = this.getSelectionRange();
    if (!e || e.collapsed) return;
    const n = e.extractContents(), o = t(n), l = document.createDocumentFragment();
    l.appendChild(o), e.insertNode(l), e.setStartAfter(o), e.setEndAfter(o);
    const s = window.getSelection();
    s == null || s.removeAllRanges(), s == null || s.addRange(e), this.saveState(), this.emitter.emit("execCommand", { command: t.name || "unknown" });
  }
  // ------------------------- Content Management -------------------------
  insertContent(t) {
    this.saveSelection();
    const e = document.createElement("div");
    e.innerHTML = t;
    const n = this.getSelectionRange();
    if (n && !n.collapsed) {
      n.deleteContents();
      const o = document.createDocumentFragment();
      for (; e.firstChild; )
        o.appendChild(e.firstChild);
      n.insertNode(o), n.collapse(!1);
      const l = window.getSelection();
      l == null || l.removeAllRanges(), l == null || l.addRange(n);
    } else
      for (; e.firstChild; )
        this.editor.appendChild(e.firstChild);
    this.saveState();
  }
  toHTML() {
    return this.editor.innerHTML;
  }
  fromHTML(t) {
    this.editor.innerHTML = t, this.saveState();
  }
}
const k = {
  name: "colorPicker",
  init(i) {
    const t = document.createElement("label");
    t.style.marginLeft = "8px", t.innerText = "Text Color: ";
    const e = document.createElement("input");
    e.type = "color", e.value = "#000000", e.style.marginLeft = "4px", e.oninput = () => {
      const n = e.value;
      i.exec((o) => {
        const l = document.createElement("span");
        return l.style.color = n, l.appendChild(o), l;
      });
    }, t.appendChild(e), i.toolbar.appendChild(t);
  }
}, w = {
  name: "font",
  init(i) {
    const t = [
      "Arial",
      "Courier New",
      "Georgia",
      "Times New Roman",
      "Verdana",
      "Comic Sans MS",
      "Impact",
      "Lucida Sans Unicode",
      "Tahoma",
      "Trebuchet MS"
    ];
    i.ui.addDropdown("fonts", {
      text: "Font",
      tooltip: "Font",
      options: t.map((e) => ({
        label: e,
        value: e,
        onSelect: (n) => {
          const o = n, l = i.getParentElement();
          if (l && l instanceof HTMLSpanElement) {
            l.style.fontFamily = o;
            return;
          }
          i.exec((s) => {
            const a = document.createElement("span");
            return a.style.fontFamily = o, a.appendChild(s), a;
          });
        }
      }))
    });
  }
}, R = {
  name: "formatting",
  init(i) {
    i.ui.addButton("bold", {
      text: "<b>B</b>",
      tooltip: "Bold",
      onAction: () => {
        const e = i.getSelectionRange();
        if (!e || e.collapsed) return;
        const n = i.getParentElement();
        if ((n == null ? void 0 : n.tagName) == "STRONG")
          return i.removeParentElement(n);
        i.exec((o) => {
          const l = document.createElement("strong");
          return l.appendChild(o), l;
        });
      }
    }), i.ui.addButton("italic", {
      text: "<i>I</i>",
      tooltip: "Italic",
      onAction: () => {
        const e = i.getSelectionRange();
        if (!e || e.collapsed) return;
        const n = i.getParentElement();
        if ((n == null ? void 0 : n.tagName) == "EM")
          return i.removeParentElement(n);
        i.exec((o) => {
          const l = document.createElement("em");
          return l.appendChild(o), l;
        });
      }
    }), i.ui.addButton("underline", {
      text: "<u>U</u>",
      tooltip: "Underline",
      onAction: () => {
        const e = i.getSelectionRange();
        if (!e || e.collapsed) return;
        const n = i.getParentElement();
        if ((n == null ? void 0 : n.tagName) == "U")
          return i.removeParentElement(n);
        i.exec((o) => {
          const l = document.createElement("u");
          return l.appendChild(o), l;
        });
      }
    }), i.ui.addButton("image", {
      text: "🖼️ Image",
      tooltip: "Insert Image",
      onAction: () => {
        const e = prompt("Enter image URL:");
        if (!e) return;
        const n = i.getSelectionRange();
        if (!n) return;
        const o = document.createElement("img");
        o.src = e, o.alt = "Inserted Image", o.style.maxWidth = "100%", n.insertNode(o), n.setStartAfter(o), n.setEndAfter(o);
        const l = window.getSelection();
        l && (l.removeAllRanges(), l.addRange(n));
      }
    }), i.ui.addDropdown("format", {
      text: "Format",
      tooltip: "Text format",
      options: [
        {
          label: "Heading 1",
          value: "h1",
          onSelect: (e) => {
            i.exec((n) => {
              const o = document.createElement(e);
              return o.appendChild(n), o;
            });
          }
        },
        {
          label: "Heading 2",
          value: "h2",
          onSelect: (e) => {
            i.exec((n) => {
              const o = document.createElement(e);
              return o.appendChild(n), o;
            });
          }
        },
        {
          label: "Heading 3",
          value: "h3",
          onSelect: (e) => {
            i.exec((n) => {
              const o = document.createElement(e);
              return o.appendChild(n), o;
            });
          }
        },
        {
          label: "Heading 4",
          value: "h4",
          onSelect: (e) => {
            i.exec((n) => {
              const o = document.createElement(e);
              return o.appendChild(n), o;
            });
          }
        },
        {
          label: "Heading 5",
          value: "h5",
          onSelect: (e) => {
            i.exec((n) => {
              const o = document.createElement(e);
              return o.appendChild(n), o;
            });
          }
        },
        {
          label: "Heading 6",
          value: "h6",
          onSelect: (e) => {
            i.exec((n) => {
              const o = document.createElement(e);
              return o.appendChild(n), o;
            });
          }
        },
        {
          label: "Paragraph",
          value: "p",
          onSelect: (e) => {
            i.exec((n) => {
              const o = document.createElement(e);
              return o.appendChild(n), o;
            });
          }
        }
      ]
    });
    const t = [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
      { label: "Justify", value: "justify" }
    ];
    i.ui.addDropdown("align", {
      text: "Align",
      tooltip: "Text alignment",
      options: t.map((e) => ({
        label: e.label,
        value: e.value,
        onSelect: (n) => {
          const o = i.getSelectionRange();
          if (!o || o.collapsed) return;
          const l = i.getParentElement();
          if (l && l instanceof HTMLElement)
            if ((l == null ? void 0 : l.tagName) == "P") {
              l.style.textAlign = n;
              return;
            } else
              i.exec((s) => {
                const a = document.createElement("p");
                return a.style.textAlign = n, a.appendChild(s), a;
              });
        }
      }))
    });
  },
  destroy(i) {
  }
}, M = {
  name: "link",
  init(i) {
    i.ui.addButton("myButton", {
      text: "Insert Link",
      onAction: () => {
        i.saveSelection(), i.ui.showModal("insertLinkModal");
        const t = document.getElementById("insertLinkModal");
        if (!t) return;
        const e = t.querySelector(
          "#modal-link-text"
        );
        let n = "";
        i.savedRange && (n = i.savedRange.toString()), e && (e.value = n, e.focus());
        const o = t.querySelector(
          "#modal-link-url"
        );
        o && (o.value = "");
      },
      tooltip: "Insert a link"
    }), i.ui.addModal({
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
          onClick: (t) => {
            t.closeModal();
          }
        },
        {
          text: "Insert",
          primary: !0,
          onClick: (t) => {
            const n = document.getElementById(
              "modal-link-url"
            ).value.trim();
            if (n) {
              const l = document.getElementById(
                "modal-link-text"
              ).value.trim() || n;
              if (i.restoreSelection(), !i.getSelectionRange()) return t.closeModal();
              const a = i.getParentElement();
              if ((a == null ? void 0 : a.tagName) === "A")
                return i.removeParentElement(a), t.closeModal();
              i.exec((c) => {
                const d = document.createElement("a");
                return d.href = n, d.target = "_blank", d.rel = "noopener noreferrer", c.childNodes.length === 0 ? d.textContent = l : d.appendChild(c), d;
              });
            }
            t.closeModal();
          }
        }
      ]
    });
  },
  destroy(i) {
  }
}, T = {
  name: "undoRedo",
  init(i) {
    i.ui.addButton("undo", {
      text: "Undo",
      tooltip: "Undo",
      onAction: () => {
        i.undo();
      }
    }), i.ui.addButton("redo", {
      text: "Redo",
      tooltip: "Redo",
      onAction: () => {
        i.redo();
      }
    }), document.addEventListener("keydown", (t) => {
      t.ctrlKey && t.key === "z" && i.undo(), t.ctrlKey && t.key === "y" && i.redo();
    });
  }
};
export {
  L as Editor,
  v as EditorEventEmitter,
  k as colorPickerPlugin,
  w as fontPlugin,
  R as formattingPlugin,
  E as getRegisteredPlugin,
  M as linkPlugin,
  C as registerPlugin,
  T as undoRedoPlugin
};
