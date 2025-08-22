#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Catalyst development environment...\n');

// 启动 Electron 开发服务器
const electronProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

electronProcess.on('close', (code) => {
  console.log(`\n📦 Electron process exited with code ${code}`);
  process.exit(code);
});

electronProcess.on('error', (err) => {
  console.error('❌ Failed to start Electron:', err);
  process.exit(1);
});

// 处理退出信号
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development environment...');
  electronProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  electronProcess.kill('SIGTERM');
});