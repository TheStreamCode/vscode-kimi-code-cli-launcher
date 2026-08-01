# Security Policy

## Supported Versions

Security fixes are applied to the latest release. Confirm the current version on the [GitHub Releases page](https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher/releases/latest) before reporting a vulnerability.

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Email security concerns to info@mikesoft.it with a clear description, affected version, reproduction details, and potential impact. Do not include live credentials or unnecessary personal data. You should receive an acknowledgement within seven days; disclosure timing will be coordinated after validation.

## Security Model

This extension launches a user-configured command in the visible VS Code integrated terminal. Review workspace trust prompts and configuration changes before running commands in untrusted repositories.

The launch command is resolved from user-level settings only; workspace and workspace-folder values are ignored. The extension also checks Workspace Trust at runtime before sending the command.

The extension does not install Kimi Code CLI, create temporary installer scripts, invoke hidden child processes, collect telemetry, access the network, handle credentials, or inspect terminal output.

For Kimi Code CLI installation and security guidance, use the [official documentation](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/getting-started.html).
