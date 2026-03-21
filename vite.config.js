import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;


          if (id.includes('node_modules/exceljs')) {
            const segments = id.split('node_modules/exceljs/')[1]?.split('/') || [];
            const excelSegment = segments[0] || 'core';
            return `vendor_exceljs_${excelSegment}`;
          }

          return undefined;
        },
      },
    },
  },
})
