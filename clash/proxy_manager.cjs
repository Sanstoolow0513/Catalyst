const { exec } = require('child_process');
const path = require('path');

class ProxyManager {
  constructor() {
    this.profilesDir = path.join(__dirname, 'clash', 'profiles');
    this.currentProfile = 'profile1'; // 默认配置
  }

  // 启动mihomo.exe并加载指定配置
  start(profileName = this.currentProfile) {
    const configPath = path.join(this.profilesDir, profileName, 'config.yaml');
    
    // 验证配置文件是否存在
    if (!this._validateConfig(configPath)) {
      console.error(`配置文件 ${configPath} 无效或不存在`);
      return false;
    }

    const command = `clash\\mihomo.exe -f "${configPath}"`;
    
    this.process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    this.process.on('exit', (code) => {
      console.log(`mihomo.exe 已退出，代码 ${code}`);
      // 自动重连逻辑
      if (this.autoRestart) {
        console.log('尝试自动重新启动...');
        setTimeout(() => this.start(profileName), 5000);
      }
    });

    this.currentProfile = profileName;
    console.log(`已启动mihomo.exe，使用配置: ${profileName}`);
  }

  // 停止mihomo.exe
  stop() {
    if (this.process) {
      this.process.kill();
      console.log('已停止mihomo.exe');
    }
  }

  // 列出所有可用配置
  listProfiles() {
    const fs = require('fs');
    try {
      const profiles = fs.readdirSync(this.profilesDir);
      console.log('可用配置:');
      profiles.forEach(profile => {
        console.log(`- ${profile}`);
      });
      return profiles;
    } catch (err) {
      console.error('无法读取配置目录:', err);
      return [];
    }
  }

  // 检查mihomo是否正在运行
  isRunning() {
    return this.process && !this.process.killed;
  }

  // 启用/禁用自动重连
  setAutoRestart(enabled) {
    this.autoRestart = enabled;
  }

  // 验证配置文件
  _validateConfig(configPath) {
    const fs = require('fs');
    const yaml = require('yaml');
    try {
      const file = fs.readFileSync(configPath, 'utf8');
      yaml.parse(file); // 验证YAML格式
      return true;
    } catch (err) {
      return false;
    }
  }
}

// 导出ProxyManager类
module.exports = ProxyManager;
