import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/app.js',
      formats: ['iife'],
      name: 'WanikaniVoiceInput',
      fileName: () => 'app.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
  },
});
