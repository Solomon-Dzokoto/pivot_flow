import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval'; connect-src 'self' http://localhost:* https://icp0.io https://*.icp0.io https://icp-api.io https://infragrid.v.network https://*.infragrid.v.network wss://*.infragrid.v.network; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; worker-src 'self' blob:; frame-src 'self'; object-src 'none'; media-src 'self'",
      'Permissions-Policy': "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
    },
    proxy: {
      '/api': {
        target: 'https://infragrid.v.network',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      supported: {
        bigint: true
      },
    },
  },
});
