import {
  Editor,
  formattingPlugin,
  undoRedoPlugin,
  fontPlugin,
  colorPickerPlugin,
} from "./lib/index";
import { contextMenuPlugin } from "./lib/plugins/contextMenu";
import { linkPlugin } from "./lib/plugins/link";
import { tablePlugin } from "./lib/plugins/table";

const toolbar = document.getElementById("soditor-toolbar");
const editorContainer = document.getElementById("soditor-editor");

const editor = new Editor(toolbar, editorContainer);
editor.use(undoRedoPlugin);
editor.use(formattingPlugin);
editor.use(linkPlugin);
editor.use(fontPlugin);
editor.use(tablePlugin);
editor.use(colorPickerPlugin);
editor.use(contextMenuPlugin)

editor.use({
  name: "examplePlugin",
  init(editor) {
    // example of events
    // editor.on("input", ({ html }) => {
    //   // Sync to backend or localStorage
    //   console.log("Real-time HTML:", html);
    // });
    // editor.on("selectionchange", ({ range }) => {
    //   console.log("User moved selection:", range);
    // });
    // editor.on("change", ({ html }) => {
    //   console.log("Content mutated via DOM:", html);
    // });
    // editor.on("contentChange", (html) => {
    //   console.log("Editor content changed:", html);
    // });
    // editor.on("execCommand", (cmd) => {
    //   console.log("Executed formatting:", cmd);
    // });
  },
  destroy(editor) {
    console.log("Plugin cleanup!");
  },
});
