# Contributing

Thanks for your interest in improving Kimi Code CLI Launcher. Keep changes focused: this is intentionally a small VS Code extension with no production dependencies.

## Architecture

| Path | Responsibility |
| --- | --- |
| `src/extension.ts` | VS Code activation, commands, trust gate, and terminal creation |
| `src/command-utils.ts` | Pure configuration, naming, settings-query, and workspace helpers |
| `test/*.test.js` | Unit, security-boundary, metadata, and packaging-contract tests |
| `test/integration/` | Real VS Code Extension Host smoke test |
| `media/` | Marketplace, toolbar, and README artwork |

The runtime uses VS Code APIs only. Do not add hidden processes, installers, downloads, telemetry, terminal-output inspection, credential handling, or production dependencies without a compelling and reviewed requirement.

## Development Setup

Requirements:

- Node.js 22.19.0 or later; `.nvmrc` selects the maintained Node.js 22 line
- npm and Git
- VS Code `^1.103.0` or later
- Xvfb for Extension Host tests on a headless Linux machine

Install exactly the locked dependency graph:

```bash
npm ci --ignore-scripts
```

The ignored install scripts belong to optional publishing and signing dependencies. They are not required to compile, test, inspect, or package this extension.

## Validation

| Command | Purpose |
| --- | --- |
| `npm run compile` | Compile TypeScript to the ignored `out/` directory |
| `npm run watch` | Recompile while source files change |
| `npm run typecheck` | Run strict TypeScript checks without emitting files |
| `npm run lint` | Lint source and tests with Biome |
| `npm run format:check` | Verify source and test formatting |
| `npm run format` | Apply the configured formatter |
| `npm run test:unit` | Compile and run unit and metadata tests |
| `npm run test:integration` | Run the VS Code Extension Host smoke test |
| `npm run check:security` | Audit the locked graph at high severity |
| `npm run check` | Run lint, formatting, type-checking, all tests, and package inspection |
| `npm run package` | Build the installable VSIX |

Before opening a pull request, run:

```bash
npm run check
npm run check:security
git diff --check
```

CI repeats the lockfile audit every Monday. Scheduled runs execute the audit only; pull requests and pushes run the full cross-platform validation and compatibility matrix.

To test the minimum supported VS Code version locally:

```powershell
$env:VSCODE_TEST_VERSION = '1.103.0'
npm run test:integration
```

On a headless Linux host:

```bash
xvfb-run -a npm run check
```

## Security Invariants

- Preserve the Workspace Trust check at the execution boundary.
- Resolve executable commands from user-level configuration only; ignore workspace and workspace-folder values.
- Send the command visibly through VS Code's terminal API.
- Never log commands, credentials, terminal output, or full sensitive paths.
- Keep `src/command-utils.ts` independent from the VS Code runtime where practical.

Add targeted regression tests whenever one of these boundaries changes. Do not add copied Kimi assets, `.env` files, publisher tokens, or automatic installation and authentication flows.

## Pull Requests

- Explain the problem and observable behavior change.
- Add or update focused tests.
- Update README and changelog content for user-visible changes.
- Preserve the existing icon and artwork unless the change specifically concerns visual presentation.
- Do not commit `out/`, `.vscode-test/`, `node_modules/`, or generated VSIX files.
- Keep action permissions minimal and pin actions to full commit SHAs.

`main` is protected. Normal contributions land through a branch and pull request with the required checks and maintainer review.

## Packaging and Release

Build a local package only after the complete validation suite passes:

```bash
npm run check
npm run check:security
npm run package
```

For a release:

1. Run `npm version <x.y.z> --no-git-tag-version`.
2. Synchronize the version and real release date in `CITATION.cff`, `CHANGELOG.md`, README installation examples, and metadata tests.
3. Re-run all validation and inspect `npm run package:list`.
4. Commit the validated changes and push the matching `v<x.y.z>` tag.

The `Release` workflow verifies the tag/version match, reruns validation and the security audit, packages the VSIX, creates a SHA-256 checksum, and creates or updates the GitHub release.

VS Code Marketplace and Open VSX publishing are separate manual maintainer steps:

```bash
npx @vscode/vsce publish --packagePath vscode-kimi-code-cli-launcher-<version>.vsix
npx ovsx publish vscode-kimi-code-cli-launcher-<version>.vsix
```

These commands require registry publisher tokens. Tokens are deliberately absent from the repository, local automation, and GitHub Actions.
