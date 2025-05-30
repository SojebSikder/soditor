import "./style.css";
import { Editor } from "./editor/editor";
import { formattingPlugin } from "./plugins/formatting";
import { undoRedoPlugin } from "./plugins/undoRedo";

const editor = new Editor("#toolbar", "#editor");
editor.use(undoRedoPlugin);
editor.use(formattingPlugin);
