import { expect, type Page } from '@playwright/test';

export async function selectTheme(page: Page, name: string) {
  await page.getByRole('button', { name: /^选择主题/ }).click();
  await page.getByRole('group', { name: '外观主题' }).getByText(name, { exact: true }).click();
  await expect(page.getByRole('radio', { name, exact: true })).toBeChecked();
  await page.getByRole('radio', { name, exact: true }).press('Escape');
}
