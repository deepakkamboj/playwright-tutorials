import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@/pages/basePage';
import { assertUrl } from '@/utils/assertionHelpers';
import { playgroundDashboard, playgroundUrl } from '@/data/contants';

export default class LoginPage extends BasePage {
  readonly emailEl: Locator;
  readonly pwdEl: Locator;
  readonly loginBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.emailEl = this.page.getByTestId('email-input');
    this.pwdEl = this.page.getByTestId('password-input');
    this.loginBtn = this.page.getByTestId('login-submit-button');
    // this.loginBtn = this.page.getByRole('button', { name: 'Sign in' })
  }

  async open() {
    console.log('Opening login page...', playgroundUrl);
    await this.page.goto(playgroundUrl);
  }

  async enterUsername(strUser: string) {
    await this.emailEl.fill(strUser);
  }
  async enterPassword(strPwd: string) {
    await this.pwdEl.fill(strPwd);
  }
  async clickLoginBtn() {
    await this.loginBtn.click();
  }
  async login(strUser: string, strPwd: string) {
    await this.enterUsername(strUser);
    await this.enterPassword(strPwd);
    await Promise.all([this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }), this.clickLoginBtn()]);
  }
  async verifyLogin() {
    const actualUrl = await this.page.url();
    await assertUrl(this.page, playgroundDashboard);
    // expect(actualUrl).toContain('inventory.html');
  }
  async verifyErrorMessage(expectedErrorMessage: string) {
    const actualErrorMessage = await this.page.getByTestId('error').textContent();
    expect(actualErrorMessage).toBe(expectedErrorMessage);
  }
}
