import { colors } from './colors';
import { Reporter, TestCase, TestResult, FullConfig, Suite } from '@playwright/test/reporter';

export interface ReporterConfig {
  outputDir?: string;
}

export default class PlaywrightTestReporter implements Reporter {
  private outputDir?: string;
  private _config: ReporterConfig;
  private suite!: Suite;

  constructor(config: ReporterConfig = {}) {
    this._config = config;
    this.outputDir = config.outputDir;
  }

  public onBegin(config: FullConfig, suite: Suite): void {
    this.suite = suite;
    const totalTestCount = this._countTests(suite);
    console.log(`${colors.fgCyan}===============================================${colors.reset}`);
    console.log(
      `${colors.fgMagentaBright}🚀 Starting test run: ${totalTestCount} tests using ${config.workers} workers${colors.reset}`,
    );
    console.log(`${colors.fgCyan}===============================================${colors.reset}`);
    console.log(`${colors.fgCyan}Test run started at: ${new Date().toLocaleString()}${colors.reset}`);
  }

  onTestBegin(test: any): void {
    console.log(`${colors.fgYellow}[TEST BEGIN]${colors.reset} ${test.title}`);
  }

  onTestEnd(test: any, result: any): void {
    const statusColor = result.status === 'passed' ? colors.fgGreen : colors.fgRed;
    console.log(`${statusColor}[TEST END]${colors.reset} ${test.title} - ${result.status}`);
  }

  onEnd(result: any): void {
    console.log(`${colors.fgMagenta}[END]${colors.reset} Test run finished.`);
  }

  private _countTests(suite: Suite): number {
    let count = suite.tests.length;
    for (const childSuite of suite.suites) {
      count += this._countTests(childSuite);
    }
    return count;
  }
}
