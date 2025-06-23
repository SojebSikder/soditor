import type { Editor } from "./editor";

export interface EditorPlugin {
  name: string;
  init(editor: Editor): void;
  destroy?(editor: Editor): void;
}

// element props
export interface EditorElementProps {
  /**
   * The text to display on the button
   */
  text?: string;
  /**
   * The tooltip to display on the button
   */
  tooltip?: string;
  /**
   * The action to perform when the button is clicked
   */
  onAction?: () => void;
}

export interface EditorButtonElementProps extends EditorElementProps {}

export interface EditorDropdownOption {
  label: string;
  value?: string;
  onSelect?: (value: string) => void;
}

export interface EditorDropDownElementProps extends EditorElementProps {
  /**
   * The options to display in the dropdown
   */
  options?: EditorDropdownOption[];
}
