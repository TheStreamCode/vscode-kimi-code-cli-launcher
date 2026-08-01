const path = require('node:path');
const { runTests } = require('@vscode/test-electron');

async function main() {
  const extensionDevelopmentPath = path.resolve(__dirname, '..', '..');
  const extensionTestsPath = path.resolve(__dirname, 'suite');
  const launchArgs = ['--disable-extensions'];
  const userDataDir =
    process.env.VSCODE_TEST_USER_DATA_DIR ||
    (process.env.RUNNER_TEMP ? path.join(process.env.RUNNER_TEMP, 'kimi-vscode-test') : undefined);

  if (userDataDir) {
    launchArgs.push(`--user-data-dir=${userDataDir}`);
  }

  try {
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs,
      version: process.env.VSCODE_TEST_VERSION || 'stable',
    });
  } catch (error) {
    console.error('VS Code integration tests failed.');
    throw error;
  }
}

main();
