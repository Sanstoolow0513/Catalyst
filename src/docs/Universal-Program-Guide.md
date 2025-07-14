# 通用程序使用指南

## 功能概述
本程序提供以下核心功能：
1. GitHub账户自动登录
2. IDE安装时自动关联GitHub账户
3. 版本管理功能

## 快速开始

### 1. GitHub登录
```javascript
const { GitHubAuth } = require('./services/auth/github-auth');
const auth = new GitHubAuth();

// 登录
const loginResult = await auth.login();
if (loginResult.token) {
  console.log('登录成功');
} else {
  console.log('需要用户授权');
}
```

### 2. IDE安装
```javascript
const { SoftwareInstallerService } = require('./services/installer/software-installer');
const installer = new SoftwareInstallerService();

const software = {
  id: 'vscode',
  name: 'Visual Studio Code',
  url: 'https://example.com/vscode-installer.exe',
  installer_args: '/SILENT'
};

await installer.installSoftware(software);
```

## API参考

### GitHubAuth类
- `login()`: 执行GitHub登录
- `handleCallback(code)`: 处理OAuth回调
- `getToken()`: 获取存储的token

### SoftwareInstallerService类
- `installSoftware(software)`: 安装指定软件
- `downloadFile(url)`: 下载安装文件
- `runInstaller(filePath, args)`: 运行安装程序

## 版本管理
程序采用本地文件版本管理，每个版本保存在src/v0.x目录下
