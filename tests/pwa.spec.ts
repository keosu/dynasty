import { test, expect, type Page } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

async function prepareOffline(page: Page) {
  await page.goto('./#/about');
  await expect(page.getByText('已可离线使用', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '关闭应用提示' }).click();
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
}

test('Pages 子路径提供可安装清单、图标和正确的应用作用域', async ({ page, request }) => {
  await prepareOffline(page);
  const manifestPath = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifestPath).toBe('/dynasty/manifest.webmanifest');
  const manifestURL = new URL(manifestPath!, page.url());
  const manifest = await (await request.get(manifestURL.href)).json();
  expect(manifest.name).toContain('山河纪');
  expect(manifest.display).toBe('standalone');
  for (const key of ['id', 'start_url', 'scope']) {
    expect(new URL(manifest[key], manifestURL).pathname).toBe('/dynasty/');
  }
  expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual([
    '192x192',
    '512x512',
    '512x512',
  ]);
  expect(manifest.icons.some((icon: { purpose: string }) => icon.purpose === 'maskable')).toBe(
    true,
  );
  for (const icon of manifest.icons) {
    const response = await request.get(new URL(icon.src, manifestURL).href);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/png');
  }
  const appleIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
  expect(appleIcon).toBe('/dynasty/icons/apple-touch-icon.png');
  expect((await request.get(appleIcon!)).ok()).toBe(true);
  expect(await page.evaluate(async () => (await navigator.serviceWorker.ready).scope)).toBe(
    new URL('./', page.url()).href,
  );
});

test('断网重开仍能切换地图、目录与世系，已读正文可用，未读正文明确提示', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await prepareOffline(page);
  // Installing from About must not eagerly download all biography bodies.
  expect(
    await page.evaluate(async () => {
      const keys = await Promise.all(
        (await caches.keys()).map(async (name) =>
          (await (await caches.open(name)).keys()).map((request) => request.url),
        ),
      );
      return keys.flat().filter((url) => url.includes('/biographies/')).length;
    }),
  ).toBe(0);
  await page.goto('./#/emperors/tang-tai-zong');
  await expect(page.locator('.biography-sections details').first()).toBeAttached();
  await expect
    .poll(() =>
      page.evaluate(async () => (await (await caches.open('shanhe-biographies-v1')).keys()).length),
    )
    .toBe(1);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.detail-hero h1')).toContainText('唐太宗');
  await expect(page.locator('.biography-sections details').first()).toBeAttached();
  await expect(page.getByRole('status', { name: '当前离线，使用已保存的资料' })).toBeVisible();
  await page.goto('./#/atlas');
  await expect(page.locator('.map-land')).toBeAttached();
  await expect(page.locator('.map-reference')).toContainText('669');
  await page.getByRole('combobox', { name: '地图朝代' }).selectOption('qing');
  await expect(page.locator('.map-reference')).toContainText('1820');
  await page.goto('./#/events');
  await expect(page.locator('.event-card').first()).toBeVisible();
  await page.goto('./#/genealogy/tang');
  await expect(page.locator('.graph-node').first()).toBeVisible();
  await page.goto('./#/emperors/qin-shi-huang');
  await expect(page.locator('.biography-sections')).toContainText('正文暂时无法加载');
  expect(errors).toEqual([]);
});

test('手机安装入口调用浏览器安装流程，安装成功后收起', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepareOffline(page);
  await page.evaluate(() => {
    const event = new Event('beforeinstallprompt', { cancelable: true });
    Object.assign(event, {
      prompt: async () => {
        document.documentElement.dataset.installPrompted = 'true';
      },
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    });
    window.dispatchEvent(event);
  });
  const button = page.getByRole('button', { name: '安装山河纪' });
  await expect(button).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-install-prompted', 'true');
  await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
  await expect(button).toHaveCount(0);
  await page.screenshot({ path: 'test-results/pwa-mobile.png' });
});

test('新版本等待用户确认，更新后保留详情路由与主题偏好', async ({ page }) => {
  await prepareOffline(page);
  await page.goto('./#/events');
  await page.evaluate(() => localStorage.setItem('shanhe-theme', 'dark'));
  const worker = new URL('../dist/sw.js', import.meta.url);
  const original = await readFile(worker, 'utf8');
  try {
    await writeFile(worker, `${original}\n// Update test ${Date.now()}\n`);
    await page.evaluate(async () => (await navigator.serviceWorker.ready).update());
    await expect(page.getByText('山河纪有新版本', { exact: true })).toBeVisible();
    expect(await page.evaluate(async () => !!(await navigator.serviceWorker.ready).waiting)).toBe(
      true,
    );
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await Promise.all([
      page.waitForEvent('domcontentloaded'),
      page.getByRole('button', { name: '立即更新', exact: true }).click(),
    ]);
    await expect(page).toHaveURL(/\/dynasty\/#\/events$/);
    await expect(page.locator('.event-card').first()).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByText('山河纪有新版本', { exact: true })).toHaveCount(0);
  } finally {
    await writeFile(worker, original);
  }
});
