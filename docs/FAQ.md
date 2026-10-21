# Frequently asked questions

## Kimi Code CLI Launcher vs. the official Kimi Code extension

This project is a terminal-first launcher. It opens the native Kimi Code CLI experience in an integrated terminal; it does not recreate editor chat or agent panels.

The [official Kimi Code extension](https://marketplace.visualstudio.com/items?itemName=moonshot-ai.kimi-code), maintained by Moonshot AI, provides a different editor integration and does not launch Kimi Code CLI in a terminal.

| | This launcher | Official Kimi Code extension |
| --- | --- | --- |
| Publisher | Mikesoft, unofficial | Moonshot AI, official |
| Primary experience | Native Kimi Code CLI in a side terminal | Official Kimi editor integration |
| Launches `kimi` in a terminal | Yes, with one click | No |
| Terminal sessions | Fresh terminal on every click | Not provided by the official extension |

## How do I run Kimi Code CLI in VS Code?

Install Kimi Code CLI from the official guide, verify `kimi --version`, install this extension, and click the blue avatar while a project file is active.

## Is this the official Kimi VS Code extension?

No. This is an independent, unofficial terminal launcher maintained by Mikesoft.

## Does the launcher install, update, or authenticate Kimi Code CLI?

No. Install, update, login, and provider configuration remain owned by Kimi Code CLI.

## Does the launcher reuse an existing Kimi terminal?

No. Every click creates a fresh terminal and starts a separate session.

## Does it work with Cursor and Windsurf?

The launcher uses standard VS Code extension and terminal APIs supported by compatible editors. Compatibility can vary by editor release; automated Extension Host coverage is provided for VS Code itself.
