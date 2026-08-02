# AGENTS.md

## Scope

These instructions apply to the entire repository. This project is a deliberately small, dependency-free-at-runtime VS Code extension; prefer focused changes over new layers, frameworks, or abstractions.

## Project Contract

- The extension opens a fresh side terminal and sends the user-configured Kimi command.
- The default command is `kimi`; official updates use `kimi upgrade`.
- The active editor's workspace is preferred, followed by the first open workspace.
- The launch command must come from user-level configuration only. Never consume workspace or workspace-folder values for executable commands.
- Terminal execution must remain blocked while `vscode.workspace.isTrusted` is false, even when the command is invoked programmatically.
- The runtime must remain transparent: no hidden child processes, installers, downloads, telemetry, terminal-output inspection, or credential handling.
- Do not change the existing design, icons, or media assets unless the task explicitly requests it. Never run `npm run generate:icon` during unrelated work.

## Repository Map

- `src/extension.ts`: VS Code integration, commands, trust check, and terminal creation.
- `src/command-utils.ts`: pure helpers; keep this module independent of the VS Code runtime where practical.
- `test/command-utils.test.js`: helper behavior and security-boundary tests.
- `test/metadata.test.js`: manifest, documentation, workflow, and package-contract tests.
- `test/integration/`: Extension Host smoke test.
- `media/`: Marketplace and toolbar artwork; preserve format, dimensions, transparency, and appearance.
- `scripts/generate-icon.ps1`: deterministic source of `media/icon.png`; it reproduces the published 512x512 artwork byte for byte, so never edit one without the other.
- `docs/SECURITY_REVIEW.md`: dated security review with file-and-line citations; re-verify the citations when the referenced files move.
- `out/`, `.vscode-test/`, `node_modules/`, and `*.vsix`: generated or downloaded artifacts; do not commit them.

## Required Workflow

1. Read the relevant source, tests, manifest, and documentation before editing.
2. Check `git status` and preserve unrelated user changes in dirty worktrees.
3. Keep security and behavior invariants covered by targeted tests.
4. Run the smallest relevant checks while iterating.
5. Before handoff, run `npm run check`, `npm run check:security`, and `git diff --check`.
6. Inspect `npm run package:list` when package contents change. Build a VSIX only when requested or when validating release behavior.

Use `npm ci --ignore-scripts` for a clean, reproducible install. Do not replace `package-lock.json` with another package-manager lockfile.

## Coding Standards

- Use strict TypeScript and the existing ESM-style source imports compiled with `NodeNext`.
- Keep runtime behavior in `extension.ts` and reusable decision logic in pure, directly testable helpers.
- Prefer VS Code APIs over Node filesystem, process, or shell APIs.
- Do not add production dependencies unless the functionality cannot reasonably be implemented with the VS Code or JavaScript standard APIs.
- Preserve LF endings, two-space indentation, single quotes, trailing commas, and semicolons. Biome is authoritative for source and test formatting.
- Avoid duplicated constants and command IDs; keep manifest contributions, implementation, tests, and documentation synchronized.
- Handle errors at the user boundary with actionable messages, without logging secrets or full sensitive paths.

## Security and Secrets

- Treat any terminal command as code execution. Keep the Workspace Trust guard and the user-level-only configuration resolution together with regression tests.
- Never read executable commands from `.vscode/settings.json`, workspace files, environment files, or repository content.
- Do not add API keys, tokens, publisher credentials, `.env` files, or real user paths. Use redacted examples only.
- The launcher does not own Kimi authentication. Direct users to official Kimi login and configuration documentation.
- Keep GitHub workflow permissions minimal and pin actions to full commit SHAs with the release tag in a same-line comment.
- `pull_request_target` workflows must never check out or execute pull-request code with write permissions.

## Tests and Compatibility

- Add unit tests for helper edge cases and metadata tests for public contract changes.
- Keep `@types/vscode` pinned to the minimum version declared by `engines.vscode`.
- The integration runner accepts `VSCODE_TEST_VERSION` and `VSCODE_TEST_USER_DATA_DIR`. CI uses a short temporary profile path to stay within macOS Unix-socket limits and covers stable VS Code on Windows, Linux, and macOS plus the minimum supported VS Code on Linux.
- Integration tests must restore exact global settings from `configuration.inspect(...).globalValue`; never write a resolved workspace or default value back to global configuration.
- Never weaken tests merely to make a change pass. Update brittle exact assertions only when the public contract intentionally changes.

## Documentation and Releases

- Update `README.md` for requirements, settings, commands, environment behavior, build, or release changes.
- Add user-visible changes to the `Unreleased` section of `CHANGELOG.md`.
- For a release, keep versions synchronized in `package.json`, `package-lock.json`, `CITATION.cff`, the README installation section, and `test/metadata.test.js`; keep the real release date synchronized between `CITATION.cff` and `CHANGELOG.md`. `npm version <x.y.z> --no-git-tag-version` is the supported way to update the manifest and the lockfile together.
- A `v<version>` tag triggers the GitHub release workflow. Do not create tags, push, publish, or upload Marketplace packages unless explicitly authorized.
- The extension is published as `mikesoft.vscode-kimi-code-cli-launcher` on the VS Code Marketplace and on Open VSX. Both registries are updated manually by the maintainer with `vsce publish` and `ovsx publish`; the required tokens are deliberately absent from this repository, from the shell environment, and from GitHub Actions secrets, so no workflow or agent can publish. Never add them.
- `main` is protected and requires one approving review. Land changes through a branch and a pull request; never self-approve or bypass the protection.
- Maintain the unofficial-project and trademark disclaimer. Do not imply endorsement by Moonshot AI or Kimi.

## Dependency Policy

- Confirm a dependency is used before adding it; prefer development-only tooling when runtime code does not need the package.
- Review direct and transitive changes in `package-lock.json`, run the high-severity audit, and avoid forced major upgrades.
- The absence of `.github/dependabot.yml` is intentional: periodic version-update PRs were disabled. Do not reintroduce them without maintainer approval; Dependabot security alerts are managed in repository settings.
