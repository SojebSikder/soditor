import type { EditorPlugin } from "./types";

const pluginRegistry: Record<string, EditorPlugin> = {};

export function registerPlugin(name: string, plugin: EditorPlugin) {
  pluginRegistry[name] = plugin;
}

export function getRegisteredPlugin(): Record<string, EditorPlugin> {
  return pluginRegistry;
}
