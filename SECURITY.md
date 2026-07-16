# Security Policy

Please do not report security vulnerabilities through public GitHub issues.

Email security concerns to info@mikesoft.it with a clear description, affected version, and reproduction details.

This extension launches a user-configured command in the visible VS Code integrated terminal. Review workspace trust prompts and configuration changes before running commands in untrusted repositories.

The extension does not install Kimi Code CLI, create temporary installer scripts, invoke child processes, collect telemetry, or inspect terminal output. It sends the configured command only after Workspace Trust is granted.

For Kimi Code CLI installation and security guidance, use the [official documentation](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/getting-started.html).
