import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {

  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const base = command === 'build' && repoName ? `/${repoName}/` : '/';

  return {
    base: base, // 自動判定：本地為 '/'，GitHub 為 '/repo-name/'
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
