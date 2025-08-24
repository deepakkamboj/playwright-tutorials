const exec = require('child_process').execSync;

async function globalSetup() {
  //await exec('npx xunit-viewer -r  results.xml -o results.html ');
  console.log('##[section]Teardown Playwright Test Environment.');
}
export default globalSetup;
