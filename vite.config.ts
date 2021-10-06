import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('🦕 vite.config.ts/defineConfig', command, mode)
  return {
    base: mode === 'development' ? './' : '/rabbit-jump/',
  }
})
