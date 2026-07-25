const FALLBACK_CLI_COMMAND = 'kimi';
const FALLBACK_TERMINAL_NAME = 'Kimi Code CLI';

type WorkspaceFolderLike<T> = { uri: T };
type WorkspaceLike<T> = {
  workspaceFolders?: readonly WorkspaceFolderLike<T>[];
  getWorkspaceFolder(uri: T): WorkspaceFolderLike<T> | undefined;
};
type ActiveEditorLike<T> = { document: { uri: T } };
type ConfigurationInspectionLike<T> = {
  defaultValue?: T;
  globalValue?: T;
};

/** Returns a trimmed CLI command with the default command as fallback. */
export function normalizeCliCommand(value: string | undefined, fallback = FALLBACK_CLI_COMMAND): string {
  return (value ?? fallback).trim();
}

/** Resolves launch command from user-level configuration only, ignoring workspace-controlled values. */
export function resolveCliCommandSetting(
  inspection: ConfigurationInspectionLike<string> | undefined,
  fallback = FALLBACK_CLI_COMMAND,
): string {
  const value = inspection?.globalValue !== undefined
    ? inspection.globalValue
    : inspection?.defaultValue ?? fallback;

  return normalizeCliCommand(value, fallback);
}

/** Returns a trimmed terminal base name or its fallback. */
export function normalizeTerminalName(value: string | undefined, fallback = FALLBACK_TERMINAL_NAME): string {
  return (value ?? fallback).trim() || fallback;
}

/** Adds a numeric suffix after the first terminal created in this extension host. */
export function buildTerminalName(value: string | undefined, sequence: number, fallback = FALLBACK_TERMINAL_NAME): string {
  const baseName = normalizeTerminalName(value, fallback);
  return sequence <= 1 ? baseName : `${baseName} ${sequence}`;
}

/** Returns a settings query scoped to the current extension. */
export function buildExtensionSettingsQuery(extensionId: string): string {
  return `@ext:${extensionId}`;
}

/** Prefers the active editor's workspace, then the first open workspace. */
export function resolveTerminalCwd<T>(
  activeEditor: ActiveEditorLike<T> | undefined,
  workspace: WorkspaceLike<T>,
): T | undefined {
  const activeWorkspaceFolder = activeEditor ? workspace.getWorkspaceFolder(activeEditor.document.uri) : undefined;
  return activeWorkspaceFolder?.uri ?? workspace.workspaceFolders?.[0]?.uri;
}

export { FALLBACK_CLI_COMMAND, FALLBACK_TERMINAL_NAME };
