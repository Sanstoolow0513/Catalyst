const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 项目根目录
const rootDir = path.resolve(__dirname, '..');

// 确保dist目录存在
const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 确保resources目录存在
const resourcesDir = path.join(rootDir, 'resources');
if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir, { recursive: true });
}

// 确保Clash配置目录存在
const clashConfigDir = path.join(resourcesDir, 'clash', 'configs');
if (!fs.existsSync(clashConfigDir)) {
  fs.mkdirSync(clashConfigDir, { recursive: true });
}

// 确保Clash核心目录存在
const clashCoreDir = path.join(resourcesDir, 'clash', 'core');
if (!fs.existsSync(clashCoreDir)) {
  fs.mkdirSync(clashCoreDir, { recursive: true });
}

// 执行构建
console.log('开始构建...');

try {
  // 先清理dist目录
  console.log('清理dist目录...');
  execSync('npm run clean', { stdio: 'inherit' });

  // 检查依赖
  console.log('检查依赖...');
  execSync('npm ci', { stdio: 'inherit' });

  // 执行构建
  console.log('执行构建...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('构建完成!');
} catch (error) {
  console.error('构建过程中出现错误:', error);
  process.exit(1);
} 