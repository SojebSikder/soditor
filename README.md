# Description

Seditor is a library for rich text editing with plugin architecture.

# Usage

A simple usage with plugins

```html
<div style="width: 100%; margin: 0 auto; max-width: 1000px;">
  <div id="seditor-toolbar"></div>
  <div id="seditor-editor">Hello world!</div>
</div>

<script>
  const editor = new Editor("#seditor-toolbar", "#seditor-editor");
  editor.use(undoRedoPlugin);
  editor.use(formattingPlugin);
  editor.use(fontPlugin);
  editor.use(colorPickerPlugin);
</script>
```
