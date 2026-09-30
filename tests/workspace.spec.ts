import { test, expect } from '@playwright/test';
import { selectTheme } from './theme-picker';

test('固定工作区、双端拖柄、跨期筛选与可折叠面板', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.map-status')).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollHeight === window.innerHeight),
  ).toBe(true);
  const axis = (await page.locator('.chronology-axis').boundingBox())!;
  const handle = page.getByRole('slider', { name: '起始年', exact: true });
  await handle.hover();
  await page.mouse.down();
  await page.mouse.move(axis.x + (axis.width * (700 + 221)) / 2133, axis.y + 30, { steps: 8 });
  await page.mouse.up();
  expect(Math.abs(Number(await handle.getAttribute('aria-valuenow')) - 700)).toBeLessThan(3);
  await page.getByRole('spinbutton', { name: '精确起始年' }).fill('700');
  await page.getByRole('spinbutton', { name: '精确结束年' }).fill('700');
  await page.getByRole('button', { name: /在位君主/ }).click();
  await expect(page.locator('.explorer-person')).toHaveCount(1);
  await expect(page.locator('.explorer-person')).toContainText('武则天');
  await page.getByRole('slider', { name: '结束年', exact: true }).press('ArrowRight');
  await expect(page.getByRole('slider', { name: '结束年', exact: true })).toHaveAttribute(
    'aria-valuenow',
    '701',
  );
  await page.getByRole('combobox', { name: '地图朝代' }).selectOption('qin');
  await expect(page.locator('.range-title')).toContainText('前221');
  await page.getByRole('button', { name: '收起探索面板' }).click();
  await expect(page.locator('.explorer-panel')).toHaveCount(0);
  await page.getByRole('button', { name: '展开探索面板' }).click();
  await expect(page.locator('.explorer-panel')).toBeVisible();
  expect(errors).toEqual([]);
});

test('精细地图、热点打开侧栏、滚轮与拖动、图层切换', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.map-territory.sourced')).toBeAttached();
  await expect(page.locator('.map-reference')).toContainText('669');
  await page.locator('.explorer-event').filter({ hasText: '安史之乱' }).click();
  await expect(page.locator('.inspector-panel h2')).toHaveText('安史之乱');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.hotspot.selected')).toHaveCount(1);
  await page.getByRole('button', { name: '关闭详情面板' }).click();
  await page.getByRole('button', { name: '重置地图缩放' }).click();
  const group = page.locator('.map-content');
  const before = await group.getAttribute('transform');
  const bounds = (await page.locator('.map-svg').boundingBox())!;
  await page.mouse.move(bounds.x + 120, bounds.y + 100);
  await page.mouse.down();
  await page.mouse.move(bounds.x + 190, bounds.y + 130, { steps: 5 });
  await page.mouse.up();
  expect(await group.getAttribute('transform')).not.toBe(before);
  await page.getByRole('button', { name: '重置地图缩放' }).click();
  await expect(group).toHaveAttribute('transform', before!);
  await page.mouse.move(bounds.x + 150, bounds.y + 200);
  await page.mouse.wheel(0, -200);
  await expect(page.locator('.map-bottom-controls')).toContainText('115%');
  await page.getByRole('button', { name: '地图图层' }).click();
  await page.getByRole('checkbox', { name: '历史疆域' }).uncheck();
  await expect(page.locator('.map-territory')).toHaveCount(0);
  await page.getByRole('checkbox', { name: '历史疆域' }).check();
  await page.getByRole('button', { name: '地图图层' }).click();
  await page.getByRole('button', { name: '重置地图缩放' }).click();
  await page.locator('.hotspot').filter({ hasText: '贞观之治' }).first().click();
  await expect(page.locator('.map-popup')).toContainText('同地事件');
  await page
    .locator('.map-popup')
    .getByRole('button', { name: /贞观之治/ })
    .click();
  await expect(page.locator('.inspector-panel h2')).toHaveText('贞观之治');
});

test('三种主题持久化、键盘选择与跨页面应用', async ({ page }) => {
  await page.goto('/');
  await selectTheme(page, '静夜暗色');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('/#/genealogy/tang');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /^选择主题/ }).click();
  await page.getByRole('radio', { name: '静夜暗色' }).press('ArrowRight');
  await expect(page.getByRole('radio', { name: '琉璃夜色' })).toBeChecked();
  await page.getByRole('radio', { name: '琉璃夜色' }).press('Escape');
  await expect(page.getByRole('button', { name: /^选择主题/ })).toBeFocused();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'colorful');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'colorful');
  for (const route of ['/#/emperors', '/#/events', '/#/about', '/']) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'colorful');
    expect(await page.locator('html').evaluate((el) => getComputedStyle(el).colorScheme)).toBe(
      'dark',
    );
  }
  await selectTheme(page, '青瓷亮色');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('shanhe-theme'))).toBe('light');
});

test('完整名录、按需人物正文、搜索、详情与事件地图往返', async ({ page }) => {
  await page.goto('/#/emperors?dynasty=ming');
  await expect(page.locator('.directory-people .emperor-card')).toHaveCount(16);
  await page.getByRole('textbox', { name: '搜索帝王', exact: true }).fill('建文');
  await page.locator('.directory-people .emperor-card').click();
  await expect(page.locator('.biography-sections details')).not.toHaveCount(0);
  await expect(page.locator('.biography-sections')).toContainText('CC BY-SA');
  await page.reload();
  await expect(page.locator('.detail-hero h1')).toContainText('建文帝');
  await page.goto('/#/emperors/tang-tai-zong');
  await page.getByRole('link', { name: /贞观之治/ }).click();
  await page.getByRole('button', { name: '在地图上查看' }).click();
  await expect(page.locator('.range-title')).toContainText('627 — 649');
  await expect(page.locator('.inspector-panel h2')).toHaveText('贞观之治');
  await page.getByRole('button', { name: '搜索百科', exact: true }).click();
  await page.getByRole('textbox', { name: '搜索关键词' }).fill('郑和');
  await page
    .getByRole('dialog')
    .getByRole('link', { name: /郑和下西洋/ })
    .click();
  await expect(page.locator('.detail-hero h1')).toHaveText('郑和下西洋');
});

test('世系覆盖晚唐、复位节点与血缘视图，点击打开档案', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/genealogy/tang');
  await expect(page.locator('.graph-node').filter({ hasText: '唐昭宗' })).toHaveCount(2);
  await expect(page.locator('.graph-node')).toHaveCount(26);
  // A large genealogy must not shrink its text automatically to fit the screen.
  await expect
    .poll(async () =>
      Math.abs((await page.locator('.graph-node').first().boundingBox())!.width - 192),
    )
    .toBeLessThan(2);
  await page.locator('.graph-node').filter({ hasText: '唐哀帝' }).click();
  await expect(page.locator('.inspector-panel h2')).toContainText('唐哀帝');
  await page.getByRole('button', { name: '关闭世系人物' }).click();
  await page.getByRole('button', { name: '血缘关系', exact: true }).click();
  expect(await page.locator('.graph-edge.family').count()).toBeGreaterThan(15);
  await page.getByRole('combobox', { name: '世系朝代' }).selectOption('ming');
  await expect(page.locator('.graph-node')).toHaveCount(16);
  await page.getByRole('button', { name: '在位顺序', exact: true }).click();
  await expect(page.locator('.graph-node').filter({ hasText: '明英宗' })).toHaveCount(2);
  expect(
    await page.evaluate(() => document.documentElement.scrollHeight === window.innerHeight),
  ).toBe(true);
});

test('手机布局固定在视口内，面板可打开和关闭', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await selectTheme(page, '琉璃夜色');
  await page.getByRole('button', { name: /^选择主题/ }).click();
  const picker = (await page.getByRole('group', { name: '外观主题' }).boundingBox())!;
  expect(picker.x).toBeGreaterThanOrEqual(0);
  expect(picker.x + picker.width).toBeLessThanOrEqual(390);
  await page.getByRole('radio', { name: '琉璃夜色' }).press('Escape');
  await expect(page.locator('.explorer-panel')).toHaveCount(0);
  await page.getByRole('button', { name: '展开探索面板' }).click();
  await page.locator('.explorer-event').filter({ hasText: '贞观之治' }).click();
  await expect(page.locator('.inspector-panel')).toBeVisible();
  await page.getByRole('button', { name: '关闭详情面板' }).click();
  await page.getByRole('button', { name: '收起探索面板' }).click();
  const timeline = (await page.locator('.app-timeline').boundingBox())!;
  expect(Math.abs(timeline.y + timeline.height - 844)).toBeLessThan(2);
  await page.screenshot({ path: 'test-results/mobile-app.png' });
  for (const path of ['/#/emperors', '/#/genealogy/tang', '/#/about']) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= innerWidth &&
          document.documentElement.scrollHeight <= innerHeight,
      ),
    ).toBe(true);
    if (path.includes('genealogy')) {
      const firstNode = page.locator('.graph-node').first();
      await expect
        .poll(async () => Math.abs((await firstNode.boundingBox())!.width - 192))
        .toBeLessThan(2);
      await page.getByRole('button', { name: '查看世系全图' }).click();
      await expect.poll(async () => (await firstNode.boundingBox())!.width).toBeLessThan(192);
      const canvas = (await page.locator('.genealogy-canvas').boundingBox())!;
      const last = (await page.locator('.graph-node').last().boundingBox())!;
      expect(last.y + last.height).toBeLessThanOrEqual(canvas.y + canvas.height);
      await page.getByRole('button', { name: '重置世系图' }).click();
      await expect
        .poll(async () => Math.abs((await firstNode.boundingBox())!.width - 192))
        .toBeLessThan(2);
    }
  }
  await page.getByRole('button', { name: '切换导航' }).click();
  await page.getByRole('navigation').getByRole('link', { name: '历史地图' }).click();
  await expect(page.locator('.history-map')).toBeVisible();
});

test('桌面三种主题与世系截图', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.map-territory.sourced')).toBeAttached();
  await page.screenshot({ path: 'test-results/app-light.png' });
  await selectTheme(page, '静夜暗色');
  await page.waitForTimeout(250);
  await page.screenshot({ path: 'test-results/app-dark.png' });
  await page.goto('/#/genealogy/tang');
  await page.screenshot({ path: 'test-results/graph-dark.png' });
  await selectTheme(page, '琉璃夜色');
  await page.waitForTimeout(250);
  await page.screenshot({ path: 'test-results/graph-colorful.png' });
  await page.goto('/');
  await expect(page.locator('.map-territory.sourced')).toBeAttached();
  await page.screenshot({ path: 'test-results/app-colorful.png' });
  await page.getByRole('button', { name: /^选择主题/ }).click();
  await page.screenshot({ path: 'test-results/theme-picker.png' });
});
