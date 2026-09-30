import { test, expect } from '@playwright/test';
import { selectTheme } from './theme-picker';

test('三国同图分色、地图点选、图例开关及在位人物', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: '三国鼎立，262年' }).click();
  await expect(page.locator('.polity-territory')).toHaveCount(3);
  await expect(page.locator('.polity-label')).toHaveCount(3);
  await expect(page.locator('.map-reference')).toContainText('三国鼎立');
  const colors = await page
    .locator('.polity-territory')
    .evaluateAll((paths) => paths.map((p) => getComputedStyle(p).fill));
  expect(new Set(colors).size).toBe(3);
  await page.getByRole('button', { name: '查看蜀汉地图资料', exact: true }).click();
  await expect(page.locator('.conflict-polity-detail')).toContainText('成都');
  await expect(page.locator('.conflict-polity-detail')).toContainText('刘禅');
  await page.getByRole('button', { name: '关闭政权资料' }).click();
  // Clicking inside the polygon, away from its text, must survive pointer capture.
  const label = (await page
    .getByRole('button', { name: '查看蜀汉地图资料', exact: true })
    .boundingBox())!;
  await page.mouse.click(label.x + label.width / 2, label.y + label.height + 8);
  await expect(page.locator('.conflict-polity-detail')).toContainText('刘禅');
  await page.getByRole('checkbox', { name: '显示魏疆域', exact: true }).uncheck();
  await expect(page.locator('.polity-territory')).toHaveCount(2);
  await page.getByRole('checkbox', { name: '显示魏疆域', exact: true }).check();
  await page.getByRole('button', { name: '关闭政权资料' }).click();
  await page.screenshot({ path: 'test-results/three-kingdoms.png' });
  await page.getByRole('button', { name: '查看蜀汉资料', exact: true }).click();
  await page.locator('.conflict-polity-detail').getByRole('link', { name: /刘禅/ }).click();
  await expect(page.locator('.detail-hero h1')).toContainText('后主');
});

test('南北朝及宋辽金两阶段、时间轴标注、图层不跨年混合', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: '南北朝后期，572年' }).click();
  await expect(page.locator('.polity-territory')).toHaveCount(4);
  await expect(page.locator('.conflict-legend')).toContainText('后梁（西梁）');
  await page.getByRole('button', { name: '查看后梁（西梁）资料', exact: true }).click();
  await expect(page.locator('.conflict-polity-detail')).toContainText('萧岿');
  await page.getByRole('button', { name: '关闭政权资料' }).click();
  await page.screenshot({ path: 'test-results/northern-southern.png' });
  await page.getByRole('button', { name: '北宋·辽·西夏，1111年' }).click();
  await expect(page.locator('.polity-territory')).toHaveCount(3);
  await expect(page.locator('[data-polity="liao"]')).toBeAttached();
  await expect(page.locator('[data-polity="jin"]')).toHaveCount(0);
  await page.screenshot({ path: 'test-results/song-liao.png' });
  await page.getByRole('button', { name: '南宋·金·西夏，1142年' }).click();
  await expect(page.locator('[data-polity="jin"]')).toBeAttached();
  await expect(page.locator('[data-polity="liao"]')).toHaveCount(0);
  await expect(page.locator('.polity-capital')).toContainText(['临安', '上京会宁府', '兴庆府']);
  await expect(page.locator('.chronology-era').filter({ hasText: /^辽$/ })).toHaveCount(1);
  await expect(page.locator('.chronology-era').filter({ hasText: /^金$/ })).toHaveCount(1);
  await selectTheme(page, '琉璃夜色');
  await page.waitForTimeout(250);
  await page.screenshot({ path: 'test-results/song-jin-colorful.png' });
  await page.getByRole('spinbutton', { name: '精确起始年' }).fill('1130');
  await page.getByRole('spinbutton', { name: '精确结束年' }).fill('1130');
  await expect(page.locator('.polity-territory')).toHaveCount(0);
  await expect(page.locator('.map-reference')).toContainText('暂无');
});

test('手机并立时期入口与可收起图例不撑开页面', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: '南宋·金·西夏，1142年' }).click();
  await expect(page.locator('.polity-territory')).toHaveCount(3);
  await page.getByRole('button', { name: '同年并立 · 1142' }).click();
  await expect(page.locator('.conflict-legend-list')).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight === innerHeight,
    ),
  ).toBe(true);
  await page.screenshot({ path: 'test-results/conflict-mobile.png' });
});
