import * as vscode from 'vscode';
import {
  FALLBACK_CLI_COMMAND,
  FALLBACK_TERMINAL_NAME,
  buildExtensionSettingsQuery,
  buildTerminalName,
  normalizeCliCommand,
  normalizeTerminalName,
  resolveTerminalCwd,
} from './command-utils.js';

const SETTINGS_NAMESPACE = 'kimiCodeCliLauncher';
let terminalSequence = 1;

async function openExtensionSettings(context: vscode.ExtensionContext): Promise<void> {
  await vscode.commands.executeCommand(
    'workbench.action.openSettings',
    buildExtensionSettingsQuery(context.extension.id),
  );
}

export function activate(context: vscode.ExtensionContext): void {
  const openCliCommand = vscode.commands.registerCommand('kimiCodeCliLauncher.openCli', async () => {
    if (!vscode.workspace.isTrusted) {
      const selection = await vscode.window.showWarningMessage(
        'Kimi Code CLI Launcher runs terminal commands in the current workspace. Trust this workspace before launching Kimi.',
        'Manage Workspace Trust',
        'Open Settings',
      );

      if (selection === 'Manage Workspace Trust') {
        await vscode.commands.executeCommand('workbench.trust.manage');
      } else if (selection === 'Open Settings') {
        await openExtensionSettings(context);
      }

      return;
    }

    const configuration = vscode.workspace.getConfiguration(SETTINGS_NAMESPACE);
    const cliCommand = normalizeCliCommand(configuration.get<string>('cliCommand', FALLBACK_CLI_COMMAND));
    const configuredTerminalName = configuration.get<string>('terminalName', FALLBACK_TERMINAL_NAME);
    const terminalBaseName = normalizeTerminalName(configuredTerminalName);
    const terminalName = buildTerminalName(configuredTerminalName, terminalSequence);

    if (!cliCommand) {
      void vscode.window.showErrorMessage(
        'Set "kimiCodeCliLauncher.cliCommand" to the command that starts Kimi Code CLI.',
      );
      return;
    }

    terminalSequence += 1;

    const terminal = vscode.window.createTerminal({
      name: terminalName,
      location: { viewColumn: vscode.ViewColumn.Beside },
      cwd: resolveTerminalCwd(vscode.window.activeTextEditor, vscode.workspace),
    });

    terminal.show();
    terminal.sendText(cliCommand, true);
    void vscode.window.setStatusBarMessage(`Started ${terminalBaseName}`, 2500);
  });

  const openSettingsCommand = vscode.commands.registerCommand(
    'kimiCodeCliLauncher.openSettings',
    async () => openExtensionSettings(context),
  );

  context.subscriptions.push(openCliCommand, openSettingsCommand);
}

export function deactivate(): void {
}
