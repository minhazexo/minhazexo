import { defineConfig } from 'vitest/config'
import path from 'path'
import esbuild from 'esbuild'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['tests/**', 'node_modules/**', 'dist/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    {
      // Vitest 4 (rolldown pipeline) drops esbuild/oxc JSX config, so transform
      // TSX files to plain JS with esbuild before the SSR transform runs.
      name: 'esbuild-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\.[jt]sx$/.test(id)) return null
        const result = await esbuild.transform(code, {
          loader: 'tsx',
          jsx: 'automatic',
          sourcemap: true,
        })
        return { code: result.code, map: result.map }
      },
    },
  ],
})
