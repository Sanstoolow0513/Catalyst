# AI 执行指令清单 (Prompts)

本文档为项目的每个构建步骤提供了精确的指令，请将这些指令逐一提供给AI工具以完成任务。

**核心要求：** AI必须严格按照指令执行，不得添加任何未在指令中明确要求的额外文件、代码或配置。

---

### 任务 1: 创建项目目录结构

**提示词:**
"严格按照 `DIRECTORY_STRUCTURE.md` 文件中定义的规划，在项目根目录下创建 `src` 目录及其所有子目录 (`main`, `renderer`, `shared`, `renderer/assets`, `renderer/components`, `renderer/hooks`, `renderer/layouts`, `renderer/pages`, `renderer/services`, `renderer/utils`, `shared/types`)。不要创建任何文件，只创建目录结构。"

---

### 任务 2: 初始化项目并配置 `package.json`

**提示词:**
"为项目创建一个 `package.json` 文件。严格执行以下操作：
1.  在根目录运行 `pnpm init`。
2.  修改生成的 `package.json`，添加 `"type": "module"` 以启用ESM。
3.  添加以下 `scripts`：
    *   `"dev": "electron-vite dev"`
    *   `"build": "electron-vite build"`
4.  使用 `pnpm` 安装以下开发依赖 (`--save-dev`):
    *   `electron`
    *   `electron-vite`
    *   `vite`
    *   `typescript`
    *   `react`
    *   `react-dom`
    *   `@types/react`
    *   `@types/react-dom`
    *   `eslint`
    *   `prettier`
5.  使用 `pnpm` 安装以下生产依赖：
    *   `axios`
    *   `framer-motion`
    *   `styled-components`
    *   `@mui/material`
    *   `@emotion/react`
    *   `@emotion/styled`
不要做任何其他修改。"

---

### 任务 3: 配置 TypeScript

**提示词:**
"为项目创建三个TypeScript配置文件：`tsconfig.json`, `tsconfig.node.json`, `tsconfig.web.json`。严格按照以下内容创建，不要有任何改动：

**`tsconfig.json` (全局配置):**
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["ESNext", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx"
  }
}
```

**`tsconfig.node.json` (主进程配置):**
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "bundler"
  },
  "include": ["electron.vite.config.ts", "src/main/**/*.ts", "src/shared/**/*.ts"]
}
```

**`tsconfig.web.json` (渲染器进程配置):**
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "jsx": "react-jsx"
  },
  "include": ["src/renderer/**/*.ts", "src/renderer/**/*.tsx", "src/shared/**/*.ts"]
}
```
"

---

### 任务 4: 配置 Electron-Vite

**提示词:**
"在根目录创建 `electron.vite.config.ts` 文件。严格使用以下代码，不要做任何修改：
```typescript
import { resolve } from 'path'
import { defineConfig, externalizeDeps } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDeps()]
  },
  preload: {
    plugins: [externalizeDeps()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
```
"

---

*后续任务的提示词将在此文档中继续添加。*