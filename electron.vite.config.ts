import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: 'src/main/index.ts'
      },
      rollupOptions: {
        external: ['electron']
      }
    }
  },
  preload: {
    build: {
      lib: {
        entry: 'src/main/preload.ts'
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer'),
        '@main': resolve('src/main'),
        '@shared': resolve('src/shared'),
        '@components': resolve('src/renderer/components'),
        '@pages': resolve('src/renderer/pages'),
        '@hooks': resolve('src/renderer/hooks'),
        '@contexts': resolve('src/renderer/contexts'),
        '@styles': resolve('src/renderer/styles'),
        '@types': resolve('src/renderer/types')
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'styled-components'],
            'ui': ['@mui/material', '@emotion/react', '@emotion/styled'],
            'utils': ['axios', 'js-yaml']
          }
        }
      }
    }
  }
})
