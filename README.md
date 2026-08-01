# Kimi Code CLI Launcher for VS Code

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/TheStreamCode/vscode-kimi-code-cli-launcher)](https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher/releases/latest)
[![CI](https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher/actions/workflows/ci.yml/badge.svg)](https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher/actions/workflows/ci.yml)

Kimi Code CLI Launcher is a lightweight, unofficial VS Code extension that starts Kimi Code CLI directly from the editor toolbar. One click opens `kimi` in a new side terminal rooted in the current workspace. There is no hidden process, automatic installer, sidebar, or telemetry.

The extension uses standard VS Code terminal APIs and is designed for compatible editors such as Cursor and Windsurf on Windows, macOS, and Linux. Automated Extension Host tests cover VS Code itself.

> **Disclaimer**
> This extension is unofficial and is not affiliated with, endorsed by, or sponsored by Moonshot AI or Kimi. The Kimi name identifies the compatible CLI only. The blue avatar is an independent redraw for this launcher, not an official Kimi asset. See [TRADEMARKS.md](TRADEMARKS.md).

## At a Glance

| | Kimi Code CLI Launcher |
| --- | --- |
| **Purpose** | Launch Kimi Code CLI from the VS Code editor toolbar |
| **Current release** | `0.1.2` |
| **Default command** | `kimi` |
| **Terminal behavior** | Opens a fresh side terminal for every launch |
| **Working directory** | Uses the workspace of the active editor when available |
| **Platforms** | Windows, macOS, and Linux |
| **Privacy** | No telemetry, analytics, or personal-data collection |

## Features

- Adds a luminous blue avatar launcher to the editor title toolbar
- Opens a fresh terminal beside the active editor on every launch
- Uses the workspace of the active editor, then the first open workspace as fallback
- Supports a configurable Kimi command and terminal label
- Supports quoted executable paths on Windows
- Requires Workspace Trust before sending a command
- Reads the launch command from user-level configuration only
- Does not collect telemetry, inspect terminal output, or install software

## Quick Start

1. Install Kimi Code CLI from the official guide.
2. Confirm that `kimi --version` works in a regular integrated terminal.
3. Install this launcher's VSIX from the latest GitHub release.
4. Open a project file and click the blue avatar in the editor toolbar.

Each click starts an independent Kimi Code CLI session in a new side terminal.

## Requirements

To use the extension:

- VS Code `^1.103.0` or a compatible editor
- Kimi Code CLI available in the integrated terminal environment
- Git for Windows before the first Kimi launch on Windows

Follow the [official Kimi Code CLI getting-started guide](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/getting-started.html) for current installation instructions.

The recommended Windows installer is:

```powershell
irm https://code.kimi.com/kimi-code/install.ps1 | iex
```

The recommended macOS and Linux installer is:

```bash
curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash
```

The official npm alternative requires Node.js 22.19.0 or later:

```bash
npm install -g @moonshot-ai/kimi-code
```

Verify the CLI before using the launcher:

```bash
kimi --version
```

On Windows, Kimi uses the Git Bash bundled with Git for Windows. If Git Bash is installed in a custom location, set `KIMI_SHELL_PATH` to the absolute path of `bash.exe`.

This extension does not install Kimi Code CLI or modify shell configuration.

## Installation

Download `vscode-kimi-code-cli-launcher-0.1.2.vsix` from the [latest GitHub release](https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher/releases/latest), then run:

```bash
code --install-extension vscode-kimi-code-cli-launcher-0.1.2.vsix
```

Alternatively, use **Extensions: Install from VSIX...** from the VS Code Command Palette.

Open a project file and click the blue avatar in the editor toolbar. Each click starts a separate Kimi Code CLI session beside the active editor.

## Configuration

| Setting | Scope | Default | Description |
| --- | --- | --- | --- |
| `kimiCodeCliLauncher.cliCommand` | User/machine | `kimi` | Command sent to the new terminal. Workspace values are intentionally ignored. |
| `kimiCodeCliLauncher.terminalName` | Window | `Kimi Code CLI` | Base label for new terminals. |

Open **Kimi Code CLI Launcher: Open Settings** from the Command Palette.

Default command:

```json
"kimiCodeCliLauncher.cliCommand": "kimi"
```

Windows path with spaces:

```json
"kimiCodeCliLauncher.cliCommand": "\"C:\\Program Files\\Kimi Code\\kimi.exe\""
```

The command is deliberately user-configurable and is sent visibly to the active shell. Review it before use, and do not place API keys or other secrets in this setting.

## Environment Variables

The launcher itself requires no `.env` file and reads no environment variables or credentials. New terminals inherit the environment that VS Code provides to the integrated shell.

Kimi Code CLI manages its own configuration outside this extension. Relevant official variables include:

- `KIMI_SHELL_PATH` for a custom Git Bash path on Windows
- `KIMI_CODE_HOME` for a custom Kimi data directory

Configure provider credentials through Kimi's documented login or configuration flow. Never commit `.env` files; this repository ignores them by default while allowing a future redacted `.env.example`.

## How It Works

Each click creates a new integrated terminal beside the editor and sends the configured command to it. Existing terminals are never reused or inspected.

The terminal starts in the workspace of the active editor. If that file is outside the workspace, the first open workspace folder is used. With no open workspace, VS Code selects the terminal directory.

The command is resolved from the user-level setting rather than workspace-controlled configuration. The launcher also checks `workspace.isTrusted` at execution time, so invoking the command programmatically cannot bypass Workspace Trust.

### Architecture

| Path | Responsibility |
| --- | --- |
| `src/extension.ts` | VS Code activation, command registration, trust gate, and terminal creation |
| `src/command-utils.ts` | Pure configuration, naming, settings-query, and workspace-resolution helpers |
| `test/*.test.js` | Unit, metadata, packaging-contract, and documentation tests |
| `test/integration/` | Real VS Code Extension Host smoke test |
| `media/` | Existing Marketplace and toolbar artwork |

The runtime has no production dependencies, network client, filesystem access, child process, background service, or telemetry SDK. The compiled JavaScript in `out/` is generated locally and excluded from Git.

## Kimi Code CLI Launcher vs. the Official Kimi Code Extension

This project is a terminal-first launcher. It opens the native Kimi Code CLI interface in an integrated terminal and intentionally does not reproduce editor chat, agent panels, or other IDE integration.

The [official Kimi Code extension](https://marketplace.visualstudio.com/items?itemName=moonshot-ai.kimi-code), maintained by Moonshot AI, provides a different editor integration and does not launch Kimi Code CLI in a terminal.

| | This launcher | Official Kimi Code extension |
| --- | --- | --- |
| **Publisher** | Mikesoft, unofficial | Moonshot AI, official |
| **Primary experience** | Native Kimi Code CLI in a side terminal | Official Kimi editor integration |
| **Launches `kimi` in a terminal** | Yes, with one click | No |
| **Launch command** | Configurable; defaults to `kimi` | Not a terminal CLI launcher |
| **Terminal sessions** | Fresh terminal on every click | Not provided by the official extension |

## Development

Development requirements:

- Node.js 22.19.0 or later; `.nvmrc` selects the maintained Node.js 22 line
- npm and Git
- Windows, macOS, or Linux; Linux integration tests require Xvfb in headless environments

Install exactly the locked dependency graph:

```bash
npm ci --ignore-scripts
```

The ignored install scripts belong to optional publishing/signing dependencies and are not needed to compile, test, inspect, or package this extension.

Useful commands:

| Command | Purpose |
| --- | --- |
| `npm run compile` | Compile TypeScript to `out/` with source maps |
| `npm run watch` | Recompile while source files change |
| `npm run typecheck` | Run strict TypeScript checks without emitting files |
| `npm run lint` | Lint TypeScript and JavaScript with Biome |
| `npm run format:check` | Verify source and test formatting |
| `npm run format` | Apply the configured formatter |
| `npm run test:unit` | Compile and run unit and metadata tests |
| `npm run test:integration` | Compile and run the VS Code Extension Host smoke test |
| `npm run check:security` | Audit the locked npm dependency graph at high severity |
| `npm run check` | Run lint, formatting, type-check, all tests, and package-content inspection |
| `npm run package` | Build the installable VSIX |

To test a specific VS Code version:

```powershell
$env:VSCODE_TEST_VERSION = '1.103.0'
npm run test:integration
```

On Linux CI or another headless Linux host:

```bash
xvfb-run -a npm run check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for change requirements and [AGENTS.md](AGENTS.md) for repository-specific AI-agent guidance.

## Build and Release

Create a local VSIX after the full validation suite passes:

```bash
npm run check
npm run check:security
npm run package
```

The package is named `vscode-kimi-code-cli-launcher-<version>.vsix` and is intentionally ignored by Git.

For a release, update `package.json`, `package-lock.json`, `CITATION.cff`, and `CHANGELOG.md` together. Commit the validated changes, then push a matching `v<version>` tag. The `Release` workflow verifies the tag/version match, reruns validation and the dependency audit, builds the VSIX, and creates or updates the GitHub release. Marketplace publishing remains a separate maintainer action and requires publisher credentials that must never be committed.

## Troubleshooting

### The terminal opens but `kimi` is not recognized

Confirm that `kimi --version` works in a regular integrated terminal. If Kimi was installed while VS Code was open, restart the editor so new terminals inherit the updated `PATH`.

### Kimi cannot find Git Bash on Windows

Install Git for Windows. For a non-default installation, set `KIMI_SHELL_PATH` to the absolute path of `bash.exe`, then restart VS Code.

### The toolbar action does not run in Restricted Mode

The launcher intentionally refuses to send terminal commands until the workspace is trusted. Review the workspace contents and configured command before granting trust.

### Multi-root workspaces

Open a file from the target workspace before clicking the launcher. The active editor determines the preferred working directory.

## Frequently Asked Questions

### How do I run Kimi Code CLI in VS Code?

Install Kimi Code CLI from the official guide, verify `kimi --version` in an integrated terminal, install this launcher's VSIX, and click the blue avatar while a project file is active.

### Is this the official Kimi VS Code extension?

No. This is an independent, unofficial terminal launcher maintained by Mikesoft.

### Does the launcher install or update Kimi Code CLI?

No. Install and update Kimi separately using the [official Kimi documentation](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/getting-started.html). The official update command is `kimi upgrade`.

### Does the launcher reuse an existing Kimi terminal?

No. Every click creates a fresh terminal and starts a separate Kimi Code CLI session.

### Does it work with Cursor and Windsurf?

The launcher is designed around standard VS Code extension and terminal APIs used by compatible editors. Compatibility can vary by editor release; automated Extension Host coverage is provided for VS Code.

## Privacy and Security

The launcher does not collect telemetry, analytics, or personal data. It does not install software, create temporary scripts, inspect terminal output, access the network, or invoke hidden child processes.

The configured command is sent visibly to the integrated terminal only after Workspace Trust is granted. See the [security policy](SECURITY.md) and the latest [repository security review](docs/SECURITY_REVIEW.md).

## Support

Open a GitHub issue for reproducible bugs and feature requests. See [SUPPORT.md](SUPPORT.md) for the information to include.

Maintained by [Michael Gasperini (Mikesoft)](https://mikesoft.it).

## License

Released under the [MIT License](LICENSE).
