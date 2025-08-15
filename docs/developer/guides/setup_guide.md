# 开发环境设置指南

## 1. 环境准备

### 1.1 系统要求
- **Windows**: Windows 10 或更高版本
- **macOS**: macOS 10.15 (Catalina) 或更高版本
- **Linux**: Ubuntu 18.04+/Debian 10+/Fedora 32+ 或其他主流发行版

### 1.2 必需软件
- **Node.js**: v18.x 或更高版本
- **pnpm**: 包管理器
- **Git**: 版本控制工具

## 2. 开发环境搭建

### 2.1 安装 Node.js
推荐使用官方安装包或版本管理工具安装 Node.js:
- 官方下载: https://nodejs.org/
- 使用 nvm (Node Version Manager):
  ```bash
  # Windows (使用 nvm-windows)
  nvm install 18
  nvm use 18
  
  # macOS/Linux (使用 nvm)
  nvm install 18
  nvm use 18
  ```

### 2.2 安装 pnpm
```bash
npm install -g pnpm
```

### 2.3 安装 Git
- Windows: 下载 Git for Windows (https://git-scm.com/download/win)
- macOS: `brew install git` 或从 https://git-scm.com/download/mac 下载
- Linux: 使用包管理器安装 (如 `sudo apt install git`)

## 3. 项目初始化

### 3.1 克隆项目
```bash
git clone <项目仓库地址>
cd Catalyst
```

### 3.2 安装依赖
```bash
pnpm install
```

### 3.3 启动开发服务器
```bash
pnpm dev
```

## 4. 开发工具推荐

### 4.1 IDE/编辑器
- **Visual Studio Code** (推荐)
  - 推荐插件:
    - ESLint
    - Prettier
    - TypeScript Importer
    - GitLens
    - Auto Rename Tag
- **WebStorm**
- **Atom**

### 4.2 浏览器开发工具
- Chrome DevTools
- React Developer Tools
- Redux DevTools (如果使用 Redux)

## 5. 项目结构说明

```
Catalyst/
├── docs/              # 文档
├── resources/         # 资源文件
├── src/              # 源代码
│   ├── main/         # 主进程代码
│   ├── renderer/     # 渲染进程代码
│   └── shared/       # 共享代码
├── test/             # 测试文件
├── package.json      # 项目配置
└── ...               # 其他配置文件
```

## 6. 开发命令

### 6.1 常用命令
```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 打包应用
pnpm package

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

### 6.2 调试
- 使用 VSCode 的调试功能
- 在代码中添加 `debugger` 语句
- 使用 Electron 的开发者工具

## 7. 代码提交规范

### 7.1 Git 分支策略
- `main`: 主分支，稳定版本
- `develop`: 开发分支
- `feature/*`: 功能开发分支
- `hotfix/*`: 热修复分支

### 7.2 提交信息规范
使用 conventional commits 格式:
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型包括:
- feat: 新功能
- fix: 修复
- chore: 构建过程或辅助工具的变动
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- perf: 性能优化
- test: 测试相关

## 8. 常见问题解决

### 8.1 依赖安装问题
```bash
# 清理缓存
pnpm store prune

# 删除 node_modules 重新安装
rm -rf node_modules
pnpm install
```

### 8.2 构建问题
```bash
# 清理构建缓存
pnpm clean

# 重新构建
pnpm build
```

### 8.3 开发服务器问题
```bash
# 重启开发服务器
pnpm dev --reset-cache
```