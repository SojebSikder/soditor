# Description
Seditor is a simple library for rich text editing with plugin architecture.

# Usage

A simple usage with plugins
```html
<div>
    <div id="toolbar"></div>
    <div id="editor" contenteditable="true">Hello world!</div>
</div>
<script>
    const editor = new Editor("#toolbar", "#editor");
    editor.use(undoRedoPlugin);
    editor.use(formattingPlugin);
</script>
```
