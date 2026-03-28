import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    exclude: ['e2e/**', 'node_modules/**', 'example/**'],
  },
});
