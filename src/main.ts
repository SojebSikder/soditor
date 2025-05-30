import "./style.css";
import { Editor } from "./editor/editor";
import { formattingPlugin } from "./plugins/formatting";
import { undoRedoPlugin } from "./plugins/undoRedo";
import { fontPlugin } from "./plugins/font";
import { colorPickerPlugin } from "./plugins/colorPicker";

const editor = new Editor("#seditor-toolbar", "#seditor-editor");
editor.use(undoRedoPlugin);
editor.use(formattingPlugin);
editor.use(fontPlugin);
editor.use(colorPickerPlugin);
