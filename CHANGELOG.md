# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Security

- Updated vulnerable transitive development dependencies and added a lockfile audit gate
- Pinned GitHub Actions to immutable commit SHAs and limited CI token permissions

### Changed

- Added Biome linting and formatting checks plus stricter TypeScript compiler options
- Aligned VS Code type definitions and integration coverage with the minimum supported editor version
- Expanded CI coverage to Windows, Linux, macOS, and the minimum supported VS Code release
- Isolated Extension Host test profiles under the runner temporary directory to avoid macOS socket-path limits
- Updated repository documentation, contributor guidance, and AI-agent instructions

## 0.1.2 - 2026-07-25

### Security

- The launch command is now read from user-level settings only. `configuration.get('cliCommand')` also resolves workspace and workspace-folder values, so a cloned repository shipping a `.vscode/settings.json` could choose the command sent to the terminal on the first toolbar click. The extension now inspects the setting and reads `globalValue`/`defaultValue`, matching the hardening the sibling launchers have carried since their first release.

## 0.1.1 - 2026-07-16

### Changed

- Updated the Marketplace icon with transparent outer corners while preserving the rounded background and luminous blue avatar
- Kept the adaptive light and dark toolbar icons unchanged

## 0.1.0 - 2026-07-16

### Added

- Editor toolbar command for opening Kimi Code CLI in a fresh side terminal
- Workspace-aware terminal directory selection
- Configurable launch command and terminal name
- Workspace Trust protection
- Luminous blue avatar artwork for toolbar and Marketplace surfaces
- Unit, metadata, integration, packaging, and cross-platform CI validation
