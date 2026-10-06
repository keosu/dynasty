import { defineConfig } from '@playwright/test';
const port = process.env.PWA_PORT || '4173';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/pwa.spec.ts',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: `http://localhost:${port}/dynasty/`, headless: true },
  webServer: {
    command: `npm run build:pages && npm run preview -- --port ${port} --strictPort --base=/dynasty/`,
    url: `http://localhost:${port}/dynasty/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  reporter: 'list',
});
