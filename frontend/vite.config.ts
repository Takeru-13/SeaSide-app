// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Backend のURL（ローカルNest: http://localhost:3000）
// .env で VITE_API_TARGET を上書き可能（例: http://127.0.0.1:3000）
const API_TARGET = process.env.VITE_API_TARGET ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  server: {
    // Vite dev server (frontend) のポートはデフォ 5173
    // ここで /api を NestJS にプロキシする
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
        // /api を外さずにそのまま backend へ渡す想定 (Nest 側の Controller が '/api' なしなら↓を有効化)
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
