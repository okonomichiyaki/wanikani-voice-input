import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['src/**/*.test.{js,ts}'],
  },
  build: {
    lib: {
      entry: 'src/app.ts',
      formats: ['iife'],
      name: 'WanikaniVoiceInput',
      fileName: () => 'app.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
  },
});
