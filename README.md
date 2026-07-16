# Kimi Code CLI Launcher for VS Code

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/TheStreamCode/vscode-kimi-code-cli-launcher)](https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher/releases/latest)
[![CI](https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher/actions/workflows/ci.yml/badge.svg)](https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher/actions/workflows/ci.yml)

Kimi Code CLI Launcher for VS Code is a lightweight, unofficial VS Code extension that starts the Kimi Code CLI AI coding agent directly from the editor toolbar. One click opens `kimi` in a new side terminal rooted in your current workspace, with no hidden process, automatic installer, sidebar, or telemetry.

Use it when you want the terminal-native Kimi experience inside VS Code. The extension also works with compatible editors such as Cursor and Windsurf on Windows, macOS, and Linux.

> **Disclaimer**
> This extension is unofficial and is not affiliated with, endorsed by, or sponsored by Moonshot AI or Kimi. The Kimi name is used only to identify the compatible CLI. The blue avatar artwork is an independent redraw for this launcher, not an official Kimi asset. See [TRADEMARKS.md](TRADEMARKS.md).

## At a Glance

| | Kimi Code CLI Launcher |
| --- | --- |
| **Purpose** | Launch Kimi Code CLI from the VS Code editor toolbar |
| **Current release** | `0.1.1` |
| **Default command** | `kimi` |
| **Terminal behavior** | Opens a fresh side terminal for every launch |
| **Working directory** | Uses the workspace of the active editor when available |
| **Platforms** | Windows, macOS, and Linux |
| **Compatible editors** | VS Code, Cursor, and Windsurf |
| **Privacy** | No telemetry, analytics, or personal-data collection |

## Features

- Adds a luminous blue avatar launcher to the editor title toolbar
- Opens a fresh terminal beside the active editor on every launch
- Uses the workspace of the active editor when available
- Falls back to the first folder in a multi-root workspace
- Runs a configurable Kimi Code CLI command
- Supports quoted executable paths on Windows
- Requires Workspace Trust before running commands
- Does not collect telemetry, analytics, or personal data

## Quick Start

1. Install Kimi Code CLI using the [official getting-started guide](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/getting-started.html).
2. Confirm that `kimi --version` works in a regular integrated terminal.
3. Install the launcher from the VSIX attached to the [latest GitHub release](https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher/releases/latest).
4. Open a project file and click the blue avatar in the editor toolbar.

Each click starts a separate Kimi Code CLI session beside the active editor.

## Requirements

- VS Code `^1.103.0` or a compatible editor
- Kimi Code CLI available in the integrated terminal environment
- Git for Windows before first launch on Windows

Follow the [official Kimi Code CLI getting-started guide](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/getting-started.html) for current installation instructions.

The recommended Windows installer is:

```powershell
irm https://code.kimi.com/kimi-code/install.ps1 | iex
```

Kimi uses the Git Bash bundled with Git for Windows. If Git Bash is installed in a custom location, set `KIMI_SHELL_PATH` to the absolute path of `bash.exe`.

The official npm alternative requires Node.js 22.19.0 or later:

```bash
npm install -g @moonshot-ai/kimi-code
```

Verify the CLI before using the launcher:

```bash
kimi --version
```

This extension does not install Kimi Code CLI or modify your shell configuration.

## Installation

Download `vscode-kimi-code-cli-launcher-0.1.1.vsix` from the [latest GitHub release](https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher/releases/latest), then install it from the command line:

```bash
code --install-extension vscode-kimi-code-cli-launcher-0.1.1.vsix
```

To build the VSIX locally instead:

```bash
npm install
npm run check
npm run package
code --install-extension vscode-kimi-code-cli-launcher-0.1.1.vsix
```

Open a file and click the blue avatar in the editor toolbar.

## How It Works

Each click creates a new integrated terminal beside the editor and sends the configured command to it. Existing terminals are never reused or inspected.

The launcher starts in the workspace of the active editor. If that file is outside the workspace, it uses the first open workspace folder. With no open workspace, VS Code selects the terminal directory.

The launcher is disabled in untrusted workspaces because it runs a user-configurable terminal command. Review both the workspace and the setting before granting trust.

## Kimi Code CLI Launcher vs. the Official Kimi Code Extension

This project is a terminal-first launcher. It opens the native Kimi Code CLI interface in an integrated terminal and intentionally does not reproduce editor chat, agent panels, or other IDE integration.

The [official Kimi Code extension](https://marketplace.visualstudio.com/items?itemName=moonshot-ai.kimi-code), maintained by Moonshot AI, provides a different editor integration and does not launch Kimi Code CLI in a terminal. This independent launcher exists specifically to provide one-click access to the native `kimi` terminal experience.

| | This launcher | Official Kimi Code extension |
| --- | --- | --- |
| **Publisher** | Mikesoft, unofficial | Moonshot AI, official |
| **Primary experience** | Native Kimi Code CLI in a side terminal | Official Kimi editor integration |
| **Launches `kimi` in a terminal** | Yes, with one click | No |
| **Launch command** | Configurable; defaults to `kimi` | Not a terminal CLI launcher |
| **Terminal sessions** | Fresh terminal on every click | Not provided by the official extension |

## Configuration

| Setting | Default | Description |
| --- | --- | --- |
| `kimiCodeCliLauncher.cliCommand` | `kimi` | Command sent to the new terminal. |
| `kimiCodeCliLauncher.terminalName` | `Kimi Code CLI` | Base label for new terminals. |

Open the settings from the Command Palette:

- `Kimi Code CLI Launcher: Open Settings`

Default command:

```json
"kimiCodeCliLauncher.cliCommand": "kimi"
```

Windows path with spaces:

```json
"kimiCodeCliLauncher.cliCommand": "\"C:\\Program Files\\Kimi Code\\kimi.exe\""
```

## Troubleshooting

### The terminal opens but `kimi` is not recognized

Confirm that `kimi --version` works in a regular integrated terminal. If Kimi was installed while VS Code was open, restart the editor so new terminals inherit the updated `PATH`.

Use only the [official installation guide](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/getting-started.html) for current setup instructions.

### Kimi cannot find Git Bash on Windows

Install Git for Windows. For a non-default installation, set `KIMI_SHELL_PATH` to the absolute path of `bash.exe`, then restart VS Code.

### Multi-root workspaces

Open a file from the target workspace before clicking the launcher. The active editor determines the preferred working directory.

## Frequently Asked Questions

### How do I run Kimi Code CLI in VS Code?

Install Kimi Code CLI from the official guide, verify that `kimi --version` works in VS Code's integrated terminal, install this launcher, then click the blue avatar in the editor toolbar. The extension opens `kimi` in a new side terminal using the active workspace as its working directory.

### Is this the official Kimi VS Code extension?

No. Kimi Code CLI Launcher is an independent, unofficial terminal launcher maintained by Mikesoft. Moonshot AI publishes the [official Kimi Code extension](https://marketplace.visualstudio.com/items?itemName=moonshot-ai.kimi-code) for its supported editor integration.

### Does the launcher install Kimi Code CLI?

No. The extension never downloads or installs Kimi, modifies your shell, or runs hidden setup scripts. Install Kimi Code CLI separately by following the [official getting-started guide](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/getting-started.html).

### Does it work with Cursor and Windsurf?

The launcher uses standard VS Code extension and integrated-terminal APIs and is designed for VS Code-compatible editors such as Cursor and Windsurf. Compatibility can vary with each editor release; VS Code is covered by the automated Extension Host test.

### Does the launcher reuse an existing Kimi terminal?

No. Every click creates a fresh terminal and starts a separate Kimi Code CLI session. Existing terminals are never inspected, modified, or reused.

## Privacy and Security

Kimi Code CLI Launcher does not collect telemetry, analytics, or personal data. It does not install software, create temporary scripts, inspect terminal output, or invoke hidden child processes.

The configured command is sent visibly to the VS Code integrated terminal only after Workspace Trust is granted.

## Development

```bash
npm install
npm run check
npm run package
```

The validation suite includes unit tests, metadata checks, an Extension Host smoke test, and package-content inspection.

## Support

Open a GitHub issue for reproducible bugs and feature requests. See [SUPPORT.md](SUPPORT.md) for the information to include.

Maintained by [Michael Gasperini (Mikesoft)](https://mikesoft.it).

## License

Released under the [MIT License](LICENSE).
