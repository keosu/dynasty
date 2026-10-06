import { defineConfig } from '@playwright/test';
const port = process.env.PLAYWRIGHT_PORT || '5173';
export default defineConfig({
  testDir: './tests',
  testIgnore: '**/pwa.spec.ts',
  fullyParallel: false,
  use: { baseURL: `http://localhost:${port}`, headless: true },
  webServer: {
    command: `npm run dev -- --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
  },
  reporter: 'list',
});
