# Security Review

- Review date: 2026-08-01
- Scope: extension runtime, manifest, tests, npm dependency graph, package contents, and GitHub Actions workflows

## Executive Summary

No critical runtime vulnerability was identified. The extension remains a small, transparent terminal launcher with no production dependencies, network access, hidden process execution, telemetry, or credential handling.

The review found two high-severity advisories in transitive development dependencies and one CI supply-chain hardening opportunity. Both were remediated without changing runtime behavior. The final npm audit reports zero known vulnerabilities.

## Critical Findings

None.

## High-Severity Findings

### SEC-001: Vulnerable transitive build dependencies — resolved

**Impact:** Processing attacker-controlled patterns or URIs in the affected build-time dependency paths could cause denial of service or URI host confusion during development or packaging.

`npm audit` reported `brace-expansion` below 5.0.8 (GHSA-mh99-v99m-4gvg) and `fast-uri` through 3.1.3 (GHSA-v2hh-gcrm-f6hx). Both were transitive development dependencies under `@vscode/vsce`; neither was shipped as an extension runtime dependency.

Resolution:

- `brace-expansion` is locked to 5.0.9 (`package-lock.json:1510`).
- `fast-uri` is locked to 3.1.5 (`package-lock.json:2167`).
- `npm run check:security` now audits the lockfile at high severity (`package.json:127`).
- CI and release jobs run the audit before accepting or publishing artifacts (`.github/workflows/ci.yml:106`, `.github/workflows/release.yml:44`).

## Medium-Severity Findings

### SEC-002: Mutable GitHub Action tags — resolved

The CI workflow referenced `actions/checkout@v7` and `actions/setup-node@v6`. Major-version tags can move, so they do not provide an immutable supply-chain boundary.

Resolution:

- All checkout and Node setup steps are pinned to verified full commit SHAs, with their major release retained in same-line comments for maintainability (`.github/workflows/ci.yml:33`, `.github/workflows/ci.yml:36`, `.github/workflows/release.yml:23`, `.github/workflows/release.yml:26`).
- Default workflow permissions remain read-only; only the release job receives scoped `contents: write` permission (`.github/workflows/release.yml:8`, `.github/workflows/release.yml:18`).

## Low-Severity Findings

### SEC-003: VS Code type definitions could drift beyond the supported minimum — resolved

The manifest supports VS Code 1.103.0, while a caret range allowed npm to install much newer VS Code type definitions. That could let a future change compile against APIs unavailable in the minimum supported editor.

Resolution:

- `@types/vscode` is pinned to 1.103.0 (`package.json:133`).
- Strict compiler checks now include exact optional properties and unchecked-index protection (`tsconfig.json:12`, `tsconfig.json:17`).
- CI exercises both stable VS Code and version 1.103.0.

## Reviewed Design Risks

### SEC-004: User-configurable terminal command — accepted by design

The extension intentionally sends a configurable command to the integrated shell (`src/extension.ts:68`). This is code execution, but it is the product's explicit function and is mitigated by multiple controls:

- execution is blocked until Workspace Trust is granted (`src/extension.ts:24`);
- command resolution uses only the global user value or manifest default and ignores workspace-controlled values (`src/command-utils.ts:25`);
- execution is visible in a newly created terminal;
- the runtime does not inspect output, invoke a hidden child process, or install anything.

Residual guidance: users must review custom commands and must not place credentials in the setting.

### SEC-005: Dependabot auto-merge trigger — reviewed, no change required

The workflow uses `pull_request_target`, which is dangerous if untrusted pull-request code is executed with write permissions. This workflow checks that the PR author is `dependabot[bot]`, never checks out PR code, and only uses Dependabot metadata before enabling GitHub's gated auto-merge (`.github/workflows/dependabot-auto-merge.yml:20`, `.github/workflows/dependabot-auto-merge.yml:23`, `.github/workflows/dependabot-auto-merge.yml:33`).

## Verification

The security conclusions are supported by:

- a clean locked install with install scripts disabled;
- strict TypeScript type-checking and Biome linting;
- unit, metadata, and VS Code Extension Host integration tests;
- package-content inspection with `vsce ls`;
- `npm audit --package-lock-only --audit-level=high`;
- review of GitHub workflow permissions, triggers, and immutable action references.

This review covers the launcher repository only. Kimi Code CLI, VS Code, compatible editors, user shell configuration, and external providers remain outside its trust boundary.
