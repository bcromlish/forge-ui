import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    primitives: 'src/primitives/index.ts',
    patterns: 'src/patterns/index.ts',
    layouts: 'src/layouts/index.ts',
    'compositions-ai': 'src/compositions/ai-elements/index.ts',
    'compositions-calendar': 'src/compositions/calendar/index.ts',
    'compositions-settings': 'src/compositions/settings/index.ts',
    'compositions-page-builder': 'src/compositions/page-builder/index.ts',
    'compositions-analytics': 'src/compositions/analytics/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  clean: true,
  external: ['react', 'react-dom'],
});
