import { defineConfig, mergeConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      typecheck: { enabled: true },
      watch: false,
    },
  }),
)
