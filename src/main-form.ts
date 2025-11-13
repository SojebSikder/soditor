document.body.innerHTML = `
  <style>
    body { font-family: system-ui, sans-serif; padding: 16px; background:#fafafa; }
    .container { display: flex; gap: 12px; }
    aside, main { border: 1px solid #ddd; border-radius: 8px; padding: 12px; background:white; }
    aside { width: 220px; }
    main { flex: 1; min-height: 300px; }
    .palette-item { padding: 8px; border: 1px solid #ccc; border-radius: 6px; cursor: grab; margin-bottom: 8px; background: white; }
    .field { border: 1px solid #e2e2e2; border-radius: 8px; padding: 12px; margin-top: 12px; background: #fff; position: relative; }
    .field-toolbar { position: absolute; top: 4px; right: 6px; display: flex; gap: 6px; }
    button { cursor: pointer; }
    .muted { color:#888; font-size:12px; }
  </style>

  <h2>Form–Style Builder</h2>
  <div class="container">
    <aside>
      <h4>Palette</h4>
      <p class="muted">Drag items into the canvas</p>
      <div id="palette"></div>
    </aside>
    <main id="canvas">Drop fields here to build your form</main>
  </div>

  <div style="margin-top:12px;display:flex;gap:8px;">
    <button id="toggle">Preview Mode</button>
    <button id="export">Export JSON</button>
    <button id="copy">Copy JSON</button>
  </div>
`;

type Field = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  options?: string[];
};

const components: Omit<Field, "id">[] = [
  { type: "text", label: "Text Input", placeholder: "Enter text" },
  { type: "textarea", label: "Textarea", placeholder: "Enter long text" },
  { type: "checkbox", label: "Checkbox" },
  { type: "select", label: "Select", options: ["Option 1", "Option 2"] },
];

const palette = document.getElementById("palette")!;
const canvas = document.getElementById("canvas")!;
const exportBtn = document.getElementById("export")!;
const copyBtn = document.getElementById("copy")!;
const toggleBtn = document.getElementById("toggle")!;

let fields: Field[] = [];
let draggedId: string | null = null;
let isPreviewMode = false;

// Populate palette
components.forEach((comp) => {
  const div = document.createElement("div");
  div.className = "palette-item";
  div.textContent = comp.label;
  div.draggable = true;
  div.ondragstart = (e) => {
    e.dataTransfer?.setData("text/plain", JSON.stringify(comp));
  };
  palette.appendChild(div);
});

canvas.ondragover = (e) => e.preventDefault();
canvas.ondrop = (e) => {
  e.preventDefault();
  const data = e.dataTransfer?.getData("text/plain");
  if (!data) return;
  const comp = JSON.parse(data);
  const id = crypto.randomUUID();
  fields.push({ id, ...comp });
  renderCanvas();
};

function renderCanvas() {
  canvas.innerHTML = "";
  if (fields.length === 0) {
    canvas.textContent = "Drop fields here to build your form";
    return;
  }

  fields.forEach((f) => {
    const div = document.createElement("div");
    div.className = "field";
    div.draggable = !isPreviewMode;
    div.ondragstart = () => (draggedId = f.id);
    div.ondragover = (e) => e.preventDefault();
    div.ondrop = () => {
      if (!draggedId || draggedId === f.id) return;
      const from = fields.findIndex((x) => x.id === draggedId);
      const to = fields.findIndex((x) => x.id === f.id);
      const [moved] = fields.splice(from, 1);
      fields.splice(to, 0, moved);
      draggedId = null;
      renderCanvas();
    };

    // Input UI
    const label = document.createElement("label");
    label.textContent = f.label;
    label.style.display = "block";

    let input: HTMLElement;
    switch (f.type) {
      case "text":
        input = document.createElement("input");
        (input as HTMLInputElement).placeholder = f.placeholder || "";
        break;
      case "textarea":
        input = document.createElement("textarea");
        (input as HTMLTextAreaElement).placeholder = f.placeholder || "";
        break;
      case "checkbox":
        input = document.createElement("input");
        (input as HTMLInputElement).type = "checkbox";
        break;
      case "select":
        input = document.createElement("select");
        f.options?.forEach((opt) => {
          const o = document.createElement("option");
          o.textContent = opt;
          (input as HTMLSelectElement).appendChild(o);
        });
        break;
      default:
        input = document.createElement("input");
    }
    (input as HTMLElement).style.width = "100%";
    (input as HTMLElement).style.padding = "6px";
    (input as HTMLInputElement | HTMLTextAreaElement).disabled = isPreviewMode;

    div.appendChild(label);
    div.appendChild(input);

    if (!isPreviewMode) {
      const toolbar = document.createElement("div");
      toolbar.className = "field-toolbar";
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.onclick = () => editField(f.id);

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.onclick = () => {
        fields = fields.filter((x) => x.id !== f.id);
        renderCanvas();
      };

      toolbar.append(editBtn, delBtn);
      div.appendChild(toolbar);
    }

    canvas.appendChild(div);
  });
}

function editField(id: string) {
  const f = fields.find((x) => x.id === id);
  if (!f) return;

  const label = prompt("Label:", f.label);
  if (label !== null) f.label = label;

  if (f.type === "text" || f.type === "textarea") {
    const placeholder = prompt("Placeholder:", f.placeholder || "");
    if (placeholder !== null) f.placeholder = placeholder;
  }

  if (f.type === "select") {
    const options = prompt(
      "Comma-separated options:",
      f.options?.join(", ") || "",
    );
    if (options !== null) f.options = options.split(",").map((x) => x.trim());
  }

  renderCanvas();
}

toggleBtn.addEventListener("click", () => {
  isPreviewMode = !isPreviewMode;
  toggleBtn.textContent = isPreviewMode ? "Edit Mode" : "Preview Mode";
  renderCanvas();
});

exportBtn.addEventListener("click", () => {
  const json = JSON.stringify(fields, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "form-schema.json";
  a.click();
  URL.revokeObjectURL(url);
});

copyBtn.addEventListener("click", async () => {
  const json = JSON.stringify(fields, null, 2);
  await navigator.clipboard.writeText(json);
  alert("Copied JSON to clipboard");
});
