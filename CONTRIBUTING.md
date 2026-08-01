# Contributing

Thanks for your interest in improving Kimi Code CLI Launcher.

## Development

Requirements:

- Node.js 22.19.0 or later
- npm
- VS Code `^1.103.0` or later

Install dependencies and run the complete validation suite:

```bash
npm ci --ignore-scripts
npm run check
npm run check:security
```

Keep changes focused and covered by tests. Update the README and changelog when user-facing behavior changes.

Do not add copied Kimi assets, automatic installers, telemetry, hidden command execution, or credentials. Preserve the user-level-only command setting and Workspace Trust guard.

Formatting and linting are enforced by Biome. Run `npm run format` when `npm run format:check` reports differences.

## Pull Requests

- Explain the problem and the observable behavior change.
- Add or update targeted tests.
- Preserve Workspace Trust protections.
- Run `npm run check` before submitting.
- Run `npm run check:security` after dependency changes.
- Do not include generated VSIX files.
