import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  plugins: [
    solidPlugin(),
    {
      ...copy({
        targets: [
          {
            src: 'src/manifest.json',
            dest: 'dist',
          },
          {
            src: 'assets/icons/*',
            dest: 'dist/icons',
          }
        ],
        hook: 'writeBundle',
      }),
      enforce: 'post'
    }, 
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});