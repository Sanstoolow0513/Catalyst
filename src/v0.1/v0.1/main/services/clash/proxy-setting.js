const { exec } = require('child_process');
const Registry = require('winreg');

class ProxyManager {
  /**
   * 创建代理管理器实例
   */
  constructor() {
  }

  async clearSystemProxy() {
    try {
      // 在Windows系统上使用注册表设置代理
      const regKey = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
      });

      await this.setRegistryValue(regKey, 'ProxyEnable', Registry.REG_DWORD, 0);
      
      await this.refreshIESettings();
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async setSystemProxy(proxyServer, proxyOverride) {
    try {
      const regKey = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
      });

      await this.setRegistryValue(regKey, 'ProxyEnable', Registry.REG_DWORD, 1);
      
      await this.setRegistryValue(regKey, 'ProxyServer', Registry.REG_SZ, proxyServer);
      
      await this.setRegistryValue(regKey, 'ProxyOverride', Registry.REG_SZ, proxyOverride);
      
      await this.refreshIESettings();
      
      return true;
    } catch (error) {
      return false;
    }
  }

  setRegistryValue(regKey, name, type, value) {
    return new Promise((resolve, reject) => {
      regKey.set(name, type, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  refreshIESettings() {
    return new Promise((resolve, reject) => {
      exec('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxySettingsPerUser /t REG_DWORD /d 1 /f', (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = { ProxyManager }; 