import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function copyAssetsPlugin() {
  return {
    name: 'copy-src-assets',
    closeBundle() {
      const srcAssets = path.resolve(__dirname, 'src/assets');
      const distSrcAssets = path.resolve(__dirname, 'dist/src/assets');
      const distAssets = path.resolve(__dirname, 'dist/assets');
      if (fs.existsSync(srcAssets)) {
        fs.mkdirSync(path.dirname(distSrcAssets), { recursive: true });
        fs.cpSync(srcAssets, distSrcAssets, { recursive: true });
        fs.cpSync(srcAssets, distAssets, { recursive: true });
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), copyAssetsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
