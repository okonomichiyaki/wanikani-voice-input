import { defineConfig } from 'vite';
import license from 'rollup-plugin-license';

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
    minify: false,
    rollupOptions: {
      plugins: [
        (() => {
          let deps = [];
          const inner = license({
            thirdParty: {
              includePrivate: false,
              output: (dependencies) => {
                deps = dependencies;
              },
            },
          });
          return {
            name: 'license-banner',
            renderChunk: inner.renderChunk,
            generateBundle(options, bundle) {
              inner.generateBundle.call(this, options, bundle);
              if (deps.length === 0) return;
              const lines = ['/*!', ' * Bundled third-party licenses:', ' *'];
              for (const dep of deps) {
                const author = dep.author && dep.author.name ? ` by ${dep.author.name}` : '';
                lines.push(` * @${dep.name} v${dep.version}${author}`);
                lines.push(` * License: ${dep.license}`);
                if (dep.licenseText) {
                  for (const line of dep.licenseText.split('\n')) {
                    lines.push(` * ${line}`);
                  }
                }
                lines.push(' *');
              }
              lines.push(' */');
              const banner = lines.join('\n') + '\n';
              for (const chunk of Object.values(bundle)) {
                if (chunk.type === 'chunk') {
                  chunk.code = banner + chunk.code;
                }
              }
            },
          };
        })(),
      ],
    },
  },
});
