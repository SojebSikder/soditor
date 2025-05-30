import type { Editor } from "./editor";

export interface EditorPlugin {
  name: string;
  init(editor: Editor): void;
  destroy?(editor: Editor): void;
}
