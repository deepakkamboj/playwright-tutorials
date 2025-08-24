import { Page } from '@playwright/test';

export const TODO_ITEMS = ['buy some cheese', 'feed the cat', 'book a doctors appointment'];

export async function createDefaultTodos(page: Page) {
  // create a new todo locator
  const newTodo = page.getByPlaceholder('What needs to be done?');

  for (const item of TODO_ITEMS) {
    await newTodo.fill(item);
    await newTodo.press('Enter');
  }
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {number} expected
 */
export async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction((e: number) => {
    return JSON.parse(localStorage['react-todos']).length === e;
  }, expected);
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {number} expected
 */
export async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction((e: number) => {
    return (
      JSON.parse(localStorage['react-todos']).filter((i: { completed: boolean }) => i.completed).length === e
    );
  }, expected);
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} title
 */
export async function checkTodosInLocalStorage(page: Page, title: string) {
  return await page.waitForFunction((t: string) => {
    return JSON.parse(localStorage['react-todos'])
      .map((i: { title: string }) => i.title)
      .includes(t);
  }, title);
}
