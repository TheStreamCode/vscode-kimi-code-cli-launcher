const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

function readText(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function readPackageJson() {
  return JSON.parse(readText('package.json'));
}

function readPngSize(relativePath) {
  const fileBuffer = fs.readFileSync(path.join(rootDir, relativePath));
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  assert.deepEqual(fileBuffer.subarray(0, 8), pngSignature);

  return {
    width: fileBuffer.readUInt32BE(16),
    height: fileBuffer.readUInt32BE(20),
  };
}

test('package metadata exposes the stable launcher interface', () => {
  const packageJson = readPackageJson();

  assert.equal(packageJson.name, 'vscode-kimi-code-cli-launcher');
  assert.equal(packageJson.displayName, 'Kimi Code CLI Launcher — Run Kimi in VS Code');
  assert.equal(
    packageJson.description,
    'Launch Kimi Code CLI from the VS Code editor toolbar in one click. Opens a fresh side terminal in your workspace. Unofficial; Windows, macOS and Linux.',
  );
  assert.equal(packageJson.publisher, 'mikesoft');
  assert.equal(packageJson.version, '0.1.4');
  assert.equal(JSON.parse(readText('package-lock.json')).version, packageJson.version);
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.icon, 'media/icon.png');
  assert.equal(packageJson.engines.vscode, '^1.103.0');
  assert.equal(packageJson.devDependencies['@types/vscode'], '1.103.0');
  assert.equal(packageJson.homepage, 'https://github.com/TheStreamCode/vscode-kimi-code-cli-launcher#readme');

  assert.deepEqual(packageJson.capabilities.untrustedWorkspaces.restrictedConfigurations, [
    'kimiCodeCliLauncher.cliCommand',
  ]);

  const [openCliCommand, openSettingsCommand] = packageJson.contributes.commands;
  assert.equal(openCliCommand.command, 'kimiCodeCliLauncher.openCli');
  assert.equal(openCliCommand.title, 'Open Kimi Code CLI in Side Terminal');
  assert.deepEqual(openCliCommand.icon, {
    light: './media/launcher-mark-light.svg',
    dark: './media/launcher-mark-dark.svg',
  });
  assert.equal(openSettingsCommand.command, 'kimiCodeCliLauncher.openSettings');

  const properties = packageJson.contributes.configuration.properties;
  assert.equal(properties['kimiCodeCliLauncher.cliCommand'].default, 'kimi');
  assert.equal(properties['kimiCodeCliLauncher.cliCommand'].scope, 'machine');
  assert.equal(properties['kimiCodeCliLauncher.terminalName'].default, 'Kimi Code CLI');
  assert.equal(properties['kimiCodeCliLauncher.terminalName'].scope, 'window');

  for (const keyword of [
    'kimi code cli',
    'kimi cli vscode',
    'kimi vscode extension',
    'kimi terminal',
    'editor toolbar',
    'side terminal',
  ]) {
    assert.ok(packageJson.keywords.includes(keyword), `Expected SEO keyword: ${keyword}`);
  }
});

test('runtime stays a transparent terminal launcher', () => {
  const extensionSource = readText('src/extension.ts');
  const commandUtilsSource = readText('src/command-utils.ts');

  assert.match(extensionSource, /terminal\.sendText\(cliCommand, true\)/);
  assert.match(extensionSource, /ViewColumn\.Beside/);
  assert.match(extensionSource, /workspace\.isTrusted/);
  assert.doesNotMatch(extensionSource, /node:(?:child_process|fs|os|path)/);
  assert.doesNotMatch(extensionSource, /shellIntegration|TerminalShellExecution/i);
  assert.doesNotMatch(extensionSource, /telemetry|analytics|installPrompt/i);
  assert.doesNotMatch(commandUtilsSource, /npm install|child_process|shell:\s*true/i);
});

test('blue avatar assets are packaged at suitable resolutions', () => {
  const marketplaceIcon = readPngSize('media/icon.png');
  const lightMark = readText('media/launcher-mark-light.svg');
  const darkMark = readText('media/launcher-mark-dark.svg');

  assert.equal(marketplaceIcon.width, 512);
  assert.equal(marketplaceIcon.height, 512);

  for (const mark of [lightMark, darkMark]) {
    assert.match(mark, /<svg/i);
    assert.match(mark, /viewBox="0 0 16 16"/);
    assert.match(mark, /radialGradient/);
    assert.match(mark, /fill="#FFFFFF"/);
    assert.doesNotMatch(mark, /<image|href=|data:/i);
  }
});

test('README documents setup, trust, privacy, and official guidance', () => {
  const readme = readText('README.md');

  assert.match(readme, /^# Kimi Code CLI Launcher for VS Code$/m);
  assert.match(readme, /lightweight, unofficial VS Code extension/i);
  assert.match(readme, /## At a Glance/);
  assert.match(readme, /## Quick Start/);
  assert.match(readme, /## Kimi Code CLI Launcher vs\. the Official Kimi Code Extension/);
  assert.match(readme, /marketplace\.visualstudio\.com\/items\?itemName=moonshot-ai\.kimi-code/);
  assert.match(readme, /does not launch Kimi Code CLI in a terminal/);
  assert.match(readme, /github\.com\/TheStreamCode\/vscode-kimi-code-cli-launcher\/releases\/latest/);
  assert.match(readme, /## Frequently Asked Questions/);
  assert.match(readme, /### How do I run Kimi Code CLI in VS Code\?/);
  assert.match(readme, /### Is this the official Kimi VS Code extension\?/);
  assert.match(readme, /new side terminal/i);
  assert.match(readme, /Windows, macOS, and Linux/);
  assert.match(readme, /unofficial and is not affiliated with, endorsed by, or sponsored by Moonshot AI or Kimi/i);
  assert.match(readme, /luminous blue avatar/i);
  assert.match(readme, /https:\/\/www\.kimi\.com\/code\/docs\/en\/kimi-code-cli\/guides\/getting-started\.html/);
  assert.match(readme, /Git for Windows/);
  assert.match(readme, /KIMI_SHELL_PATH/);
  assert.match(readme, /Node\.js 22\.19\.0/);
  assert.match(readme, /npm install -g @moonshot-ai\/kimi-code/);
  assert.match(readme, /does not install Kimi Code CLI/i);
  assert.match(readme, /does not collect telemetry, analytics, or personal data/i);
  assert.match(readme, /workspace of the active editor/i);
  assert.match(readme, /npm run check/);
  assert.match(readme, /## Environment Variables/);
  assert.match(readme, /## Build and Release/);
  assert.match(readme, /vscode-kimi-code-cli-launcher-0\.1\.4\.vsix/);
  assert.doesNotMatch(readme, /vscode-kimi-code-cli-launcher-0\.1\.[123]\.vsix/);
});

test('README documents every published distribution channel', () => {
  const readme = readText('README.md');

  assert.match(readme, /marketplace\.visualstudio\.com\/items\?itemName=mikesoft\.vscode-kimi-code-cli-launcher/);
  assert.match(readme, /open-vsx\.org\/extension\/mikesoft\/vscode-kimi-code-cli-launcher/);
  assert.match(readme, /code --install-extension mikesoft\.vscode-kimi-code-cli-launcher/);
  assert.match(readme, /### VS Code Marketplace/);
  assert.match(readme, /### Open VSX/);
  assert.match(readme, /### VSIX from a GitHub release/);
});

test('public governance documents use consistent identity and support links', () => {
  assert.match(readText('LICENSE'), /Copyright \(c\) 2026 Michael Gasperini \(Mikesoft\)/);
  assert.match(readText('TRADEMARKS.md'), /unofficial/i);
  assert.match(readText('TRADEMARKS.md'), /Moonshot AI/);
  assert.match(readText('SECURITY.md'), /info@mikesoft\.it/);
  assert.match(readText('SUPPORT.md'), /vscode-kimi-code-cli-launcher\/issues/);
  assert.match(readText('CITATION.cff'), /title: "Kimi Code CLI Launcher"/);
  assert.match(readText('CITATION.cff'), /version: "0\.1\.4"/);
  assert.match(readText('AGENTS.md'), /user-level configuration only/i);
});

test('CI validates securely across supported platforms and editor versions', () => {
  const workflow = readText('.github/workflows/ci.yml');

  assert.match(workflow, /^name: CI$/m);
  assert.match(workflow, /windows-latest/);
  assert.match(workflow, /ubuntu-latest/);
  assert.match(workflow, /macos-latest/);
  assert.match(workflow, /vscode: '1\.103\.0'/);
  assert.match(workflow, /cache: npm/);
  assert.match(workflow, /npm ci --ignore-scripts/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /npm run check:security/);
  assert.match(workflow, /permissions:\s+contents: read/);
  assert.match(workflow, /actions\/checkout@[0-9a-f]{40} # v7/);
  assert.match(workflow, /actions\/setup-node@[0-9a-f]{40} # v6/);
  assert.doesNotMatch(workflow, /uses: actions\/(?:checkout|setup-node)@v\d+/);
});

test('integration runner supports a short isolated VS Code profile path', () => {
  const runner = readText('test/integration/runTest.js');

  assert.match(runner, /process\.env\.VSCODE_TEST_USER_DATA_DIR/);
  assert.match(runner, /process\.env\.RUNNER_TEMP/);
  assert.match(runner, /--user-data-dir=\$\{userDataDir\}/);
});

test('release workflow validates, audits, packages, and publishes matching tags', () => {
  const workflow = readText('.github/workflows/release.yml');

  assert.match(workflow, /^name: Release$/m);
  assert.match(workflow, /tags:\s+- 'v\*\.\*\.\*'/);
  assert.match(workflow, /test "\$GITHUB_REF_NAME" = "v\$PACKAGE_VERSION"/);
  assert.match(workflow, /permissions:\s+contents: write/);
  assert.match(workflow, /npm ci --ignore-scripts/);
  assert.match(workflow, /xvfb-run -a npm run check/);
  assert.match(workflow, /npm run check:security/);
  assert.match(workflow, /npm run package/);
  assert.match(workflow, /gh release (?:upload|create)/);
  assert.doesNotMatch(workflow, /uses: actions\/(?:checkout|setup-node)@v\d+/);
});
