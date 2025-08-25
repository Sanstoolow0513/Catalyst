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
        entry: 'src/main/preload.ts',
        fileName: 'preload.js',
        formats: ['cjs']
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
            'react-vendor': ['react', 'react-dom'],
            'styled-components': ['styled-components'],
            'mui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
            'icons': ['lucide-react', 'react-icons'],
            'utils': ['axios', 'js-yaml'],
            'animation': ['framer-motion'],
            'routing': ['react-router-dom']
          }
        }
      }
    }
  }
})
