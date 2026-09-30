import { test, expect } from '@playwright/test';
import { selectTheme } from './theme-picker';

test('事件目录利用桌面宽度，组合筛选、排序及地图入口可用', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/events');
  const cards = page.locator('.event-card');
  await expect(cards.first()).toBeVisible();
  const first = (await cards.nth(0).boundingBox())!;
  const second = (await cards.nth(1).boundingBox())!;
  expect(second.y).toBe(first.y);
  expect(second.x).toBeGreaterThan(first.x + first.width);
  const grid = (await page.locator('.event-grid').boundingBox())!;
  const columns = await page
    .locator('.event-grid')
    .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  expect(columns).toBeGreaterThanOrEqual(3);
  const last = (await cards.nth(columns - 1).boundingBox())!;
  expect(Math.abs(last.x + last.width - grid.x - grid.width)).toBeLessThan(2);
  await page.screenshot({ path: 'test-results/events-desktop.png' });
  await selectTheme(page, '琉璃夜色');
  await page.waitForTimeout(250);
  await page.screenshot({ path: 'test-results/events-colorful.png' });

  await page.getByRole('combobox', { name: '筛选朝代' }).selectOption('tang');
  await page.getByRole('combobox', { name: '事件类别' }).selectOption('战争');
  await expect(cards).toHaveCount(3);
  await expect(cards.first().locator('h2')).toHaveText('唐灭东突厥');
  await page.getByRole('combobox', { name: '事件排序' }).selectOption('desc');
  await expect(cards.first().locator('h2')).toHaveText('黄巢起义');
  await page.getByRole('textbox', { name: '搜索事件', exact: true }).fill('长安');
  await expect(cards).toHaveCount(1);
  await page.getByRole('button', { name: '在地图查看：黄巢起义', exact: true }).click();
  await expect(page.locator('.inspector-panel h2')).toHaveText('黄巢起义');
  await expect(page.locator('.range-title')).toContainText('875 — 884');

  await page.goto('/#/events?dynasty=tang&start=760&end=760');
  await expect(cards).toHaveCount(1);
  await cards.getByRole('link', { name: '安史之乱', exact: true }).click();
  await expect(page.locator('.detail-hero h1')).toHaveText('安史之乱');
  await page.goto('/#/events?dynasty=tang&start=760&end=760');
  await page.getByRole('combobox', { name: '事件类别' }).selectOption('文化');
  await expect(page.getByText('没有找到匹配的事件', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: '清除时间筛选 ×' }).click();
  await page.getByRole('combobox', { name: '事件类别' }).selectOption('交流');
  await page.getByRole('link', { name: '鉴真东渡抵达日本', exact: true }).click();
  await expect(page.locator('.detail-hero h1')).toHaveText('鉴真东渡抵达日本');
  await expect(page.getByRole('link', { name: /PDF 第 25 页/ })).toBeVisible();
  await expect(page.locator('.detail-aside')).toContainText('唐玄宗');
});

test('手机事件卡片保持单列、可读字号和可用操作', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/events');
  const cards = page.locator('.event-card');
  await expect(cards.first()).toBeVisible();
  const first = (await cards.nth(0).boundingBox())!;
  const second = (await cards.nth(1).boundingBox())!;
  expect(second.x).toBe(first.x);
  expect(second.y).toBeGreaterThan(first.y + first.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  for (const control of await page.locator('.event-toolbar select').all()) {
    const box = (await control.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.width).toBeGreaterThanOrEqual(100);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
  }
  expect(
    await cards
      .first()
      .locator('h2')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(17);
  expect(
    await cards
      .first()
      .locator('.event-card-summary')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(14);
  await page.screenshot({ path: 'test-results/events-mobile.png' });
  await page.getByRole('textbox', { name: '搜索事件', exact: true }).fill('巨鹿');
  await expect(cards).toHaveCount(1);
  await cards.getByRole('button', { name: '在地图查看：巨鹿之战' }).click();
  await expect(page.locator('.inspector-panel h2')).toHaveText('巨鹿之战');
});
