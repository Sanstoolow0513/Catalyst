const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const electron = require('electron');

// 项目根目录
const rootDir = path.resolve(__dirname, '..');

// 设置环境变量
process.env.NODE_ENV = 'development';

// 确保resources目录结构
const resourceDirs = [
  path.join(rootDir, 'resources'),
  path.join(rootDir, 'resources', 'clash'),
  path.join(rootDir, 'resources', 'clash', 'configs'),
  path.join(rootDir, 'resources', 'clash', 'core')
];

resourceDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`创建目录: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 确保Clash配置文件存在
const urlFile = path.join(rootDir, 'resources', 'clash', 'configs', 'url.txt');
if (!fs.existsSync(urlFile)) {
  fs.writeFileSync(urlFile, 'https://example.com/clash-config.yaml\n');
  console.log(`创建URL文件: ${urlFile}`);
}

// 启动开发服务器
console.log('启动开发服务器...');
const electronProcess = spawn(electron, ['.'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    ELECTRON_ENABLE_LOGGING: 1
  }
});

electronProcess.on('close', (code) => {
  console.log(`开发服务器已退出，退出码: ${code}`);
});

// 监听Ctrl+C，优雅退出
process.on('SIGINT', () => {
  console.log('接收到退出信号，正在关闭开发服务器...');
  electronProcess.kill();
  process.exit(0);
}); 