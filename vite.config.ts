import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
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
