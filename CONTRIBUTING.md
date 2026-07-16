# Contributing

Thanks for your interest in improving Kimi Code CLI Launcher.

## Development

Requirements:

- Node.js 22 or later
- npm
- VS Code `^1.103.0` or later

Install dependencies and run the complete validation suite:

```bash
npm install
npm run check
```

Keep changes focused and covered by tests. Update the README and changelog when user-facing behavior changes.

Do not add copied Kimi assets, automatic installers, telemetry, or hidden command execution.

## Pull Requests

- Explain the problem and the observable behavior change.
- Add or update targeted tests.
- Preserve Workspace Trust protections.
- Run `npm run check` before submitting.
- Do not include generated VSIX files.
