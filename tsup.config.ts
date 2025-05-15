import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    // Explicitly set options for dts build to avoid the incremental flag issue
    compilerOptions: {
      incremental: false,
    },
  },
  external: ['react', 'react-dom'],
  sourcemap: true,
  clean: true,
  esbuildPlugins: [sassPlugin()],
  outDir: 'dist',
  // Ensures SCSS files are processed but not included in JS output
  loader: {
    '.scss': 'css'
  },
  // Copy SCSS files to dist
  onSuccess: 'pnpm run copy-styles'
});
