import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        id: './',
        name: '山河纪 · 历代王朝百科',
        short_name: '山河纪',
        description: '以地图与时间轴探索中国历代王朝、帝王生平、历史事件与世系更替。',
        lang: 'zh-CN',
        start_url: './',
        scope: './',
        display: 'standalone',
        theme_color: '#256787',
        background_color: '#edf0ed',
        icons: [
          { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache the app and map data together; biographies stay on demand.
        globPatterns: [
          '**/*.{js,css,html,png,svg,webmanifest}',
          'data/*.{json,geojson}',
          'data/licenses/*.txt',
        ],
        cleanupOutdatedCaches: true,
        navigateFallbackDenylist: [/\/data\//],
        runtimeCaching: [
          {
            urlPattern: ({ sameOrigin, url }) =>
              sameOrigin && /\/data\/biographies\/[^/]+\.json$/.test(url.pathname),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'shanhe-biographies-v1',
              networkTimeoutSeconds: 3,
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 400, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('src/data/generated')) return 'historical-catalog';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
