# Catalyst - 现代化代理管理工具

基于 Electron + Vite + React + TypeScript 构建的现代化代理管理工具，专为开发者和网络管理员设计。

## 🚀 特性

- **现代化UI设计**：采用 shadcn/ui + TailwindCSS 构建的现代化界面
- **高性能架构**：基于 Vite + Electron 的现代化构建流程
- **TypeScript 支持**：完整的类型安全和开发体验
- **实时状态管理**：使用 Zustand 进行高效的状态管理
- **跨平台支持**：支持 Windows、macOS 和 Linux
- **内嵌浏览器**：集成浏览器功能，方便测试代理
- **开发工具箱**：内置常用开发工具管理

## 🛠️ 技术栈

- **Electron**: 跨平台桌面应用框架
- **Vite**: 现代化构建工具
- **React 18**: 用户界面框架
- **TypeScript**: 类型安全的 JavaScript
- **TailwindCSS**: 实用优先的 CSS 框架
- **shadcn/ui**: 可复用的组件库
- **Zustand**: 轻量级状态管理
- **Radix UI**: 无障碍组件库

## 📁 项目结构

```
catalyst/
├── src/
│   ├── main/           # Electron 主进程
│   │   ├── main.ts     # 主进程入口
│   │   └── preload.ts  # 预加载脚本
│   ├── renderer/       # React 渲染进程
│   │   ├── components/ # UI组件
│   │   ├── pages/      # 页面组件
│   │   ├── stores/     # 状态管理
│   │   └── styles/     # 样式文件
│   └── shared/         # 共享类型和常量
├── dist/               # 构建输出
└── electron-dist/      # Electron 构建输出
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 构建应用
npm run build

# 构建生产版本
npm run build:prod
```

## 📖 使用指南

### 仪表盘
- 查看系统资源使用情况
- 监控网络状态
- 快速控制 Clash 服务

### 代理管理
- 查看和管理代理节点
- 测试代理延迟
- 切换代理模式

### 工具箱
- 管理开发工具（Node.js, Python, Git, Docker）
- 查看工具安装状态
- 一键安装/更新工具

### 内嵌浏览器
- 在应用内浏览网页
- 测试代理效果
- 多标签页管理

### 设置
- 配置应用偏好
- 设置代理参数
- 管理主题和语言

## 🔧 开发指南

### 添加新页面

1. 在 `src/renderer/pages/` 创建新的页面组件
2. 在 `src/renderer/App.tsx` 添加路由
3. 在侧边栏组件中添加导航项

### 状态管理

使用 Zustand 进行状态管理：

```typescript
// 创建新的 store
import { create } from 'zustand'

interface MyStore {
  data: string[]
  addData: (data: string) => void
}

const useMyStore = create<MyStore>((set) => ({
  data: [],
  addData: (data) => set((state) => ({ data: [...state.data, data] })),
}))
```

### 组件开发

使用 shadcn/ui 的组件模式：

```typescript
import { Button } from '@/renderer/components/ui/button'

function MyComponent() {
  return (
    <div>
      <Button variant="outline" size="lg">
        点击我
      </Button>
    </div>
  )
}
```

## 📦 构建和发布

### 构建命令

```bash
# 开发构建
npm run build:dev

# 生产构建
npm run build:prod

# 为特定平台构建
npm run build:win
npm run build:mac
npm run build:linux
```

### 自动更新

应用支持自动更新功能，需要在 `electron-builder.yml` 中配置更新服务器。

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

- 提交 [Issue](https://github.com/your-repo/catalyst/issues)
- 查看 [文档](docs/)
- 加入社区讨论

## 🔄 从旧版本迁移

1. 备份现有配置
2. 运行新版本的安装程序
3. 配置将自动迁移到新版本
4. 检查设置页面确保一切正常

---

**注意**: 这是一个现代化重构的项目，完全替换了原有的 Electron + Webpack 架构，提供了更好的开发体验和性能表现。
