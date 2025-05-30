import "./style.css";
import { Editor } from "./editor/editor";
import { boldPlugin } from "./plugins/bold";
import { italicPlugin } from "./plugins/italic";
import { imagePlugin } from "./plugins/image";

const editor = new Editor("#toolbar", "#editor");
editor.use(boldPlugin);
editor.use(italicPlugin);
editor.use(imagePlugin);
