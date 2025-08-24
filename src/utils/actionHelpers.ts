import { Locator, Page } from '@playwright/test';

export async function enterText(selector: Locator, text: string) {
  await selector.clear();
  await selector.fill(text);
}

export async function gotoUrl(page: Page, url: string) {
  await page.goto(url);
}

export async function clickButton(selector: Locator) {
  await selector.click();
}

export async function selectCheckbox(selector: Locator) {
  await selector.check();
}

export async function selectOptions(selector: Locator, value: string | string[]) {
  await selector.selectOption(value);
}

export async function doubleClick(selector: Locator) {
  await selector.dblclick();
}

export async function rightClick(selector: Locator) {
  await selector.click({ button: 'right' });
}

export async function shiftClick(selector: Locator) {
  await selector.click({ modifiers: ['Shift'] });
}

export async function mouseHover(selector: Locator) {
  await selector.hover();
}

export async function waitForElement(selector: Locator) {
  await selector.waitFor();
}

export async function scrollToElement(selector: Locator) {
  await selector.scrollIntoViewIfNeeded();
}
