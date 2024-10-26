import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@database': path.resolve(__dirname, '..', 'database'),
      '@middlewares': path.resolve(__dirname, '..', 'middlewares'),
    },
  },
})
