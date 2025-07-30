# Catalyst

Catalyst 是一个基于 Electron 的应用程序。

## 目录结构

```
Catalyst/
├── src/                  # 源代码
│   ├── main/             # 主进程代码
│   ├── renderer/         # 渲染进程代码
│   ├── shared/           # 共享代码
│   ├── core/             # 核心二进制文件
│   ├── config/           # 配置文件
│   └── data/             # 应用数据
├── docs/                 # 文档
├── papers/               # 学术论文资料
├── tools/                # 构建工具
└── resources/            # 资源文件
```

## 文档

详细的文档请参见 [docs](docs/) 目录。

## 开发

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建
```bash
npm run build
