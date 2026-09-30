import { test, expect } from '@playwright/test';

test('教材参考完整适配画布，来源、时间范围和西域热点联动', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.map-territory.textbook')).toBeAttached();
  await expect(page.locator('.map-reference')).toContainText('669');
  const canvas = (await page.locator('.map-svg').boundingBox())!;
  const territory = (await page.locator('.map-territory').boundingBox())!;
  expect(territory.x).toBeGreaterThanOrEqual(canvas.x);
  expect(territory.x + territory.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(territory.y).toBeGreaterThanOrEqual(canvas.y);
  expect(territory.y + territory.height).toBeLessThanOrEqual(canvas.y + canvas.height);
  await page.getByRole('button', { name: '疆域依据与参考年份' }).click();
  await expect(page.getByRole('region', { name: '疆域依据', exact: true })).toContainText(
    '第 37 页',
  );
  await expect(page.getByRole('region', { name: '疆域依据', exact: true })).toContainText(
    '非官方 GIS',
  );
  await page.getByRole('button', { name: '关闭疆域依据' }).click();
  await page.getByRole('spinbutton', { name: '精确起始年' }).fill('800');
  await page.getByRole('spinbutton', { name: '精确结束年' }).fill('800');
  await expect(page.locator('.map-territory')).toHaveCount(0);
  await expect(page.locator('.map-reference')).toContainText('暂无');
  await page.getByRole('button', { name: /选择其他年代参考图/ }).click();
  await page.getByLabel('参考图年代').selectOption('tang-669-textbook');
  await expect(page.locator('.map-reference')).toContainText('手动参考');
  await expect(page.getByRole('spinbutton', { name: '精确起始年' })).toHaveValue('800');
  await page.getByRole('button', { name: '关闭疆域依据' }).click();
  await page.getByRole('spinbutton', { name: '精确起始年' }).fill('702');
  await page.getByRole('spinbutton', { name: '精确结束年' }).fill('702');
  await expect(page.locator('.map-territory')).toHaveCount(0);
  await page.locator('.hotspot').filter({ hasText: '北庭都护府设立' }).click();
  await expect(page.locator('.inspector-panel h2')).toContainText('北庭都护府');
  await page.screenshot({ path: 'test-results/western-regions-event.png' });
});

test('清代、汉代切换使用新参考，旧版朝代明确标识未校订', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox', { name: '地图朝代' }).selectOption('qing');
  await expect(page.locator('.map-reference')).toContainText('1820');
  await expect(page.locator('.map-territory.textbook')).toBeAttached();
  await page.screenshot({ path: 'test-results/qing-textbook.png' });
  await page.getByRole('combobox', { name: '地图朝代' }).selectOption('western-han');
  await expect(page.locator('.map-reference')).toContainText('西汉后期');
  await page.screenshot({ path: 'test-results/han-textbook.png' });
  await page.getByRole('combobox', { name: '地图朝代' }).selectOption('ming');
  await expect(page.locator('.map-reference')).toContainText('旧版未校订');
});

test('教材图层加载失败时显示错误，不退回缺少西域的旧唐图', async ({ page }) => {
  await page.route('**/data/textbook-boundaries.json', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('疆域资料加载失败');
  await expect(page.locator('.map-land')).toBeAttached();
  await expect(page.locator('.map-territory')).toHaveCount(0);
  await expect(page.locator('.map-reference')).not.toContainText('800');
});
