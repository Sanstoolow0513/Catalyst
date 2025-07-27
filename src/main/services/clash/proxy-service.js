const { exec } = require('child_process');
const Registry = require('winreg');

class ProxyService {
  /**
   * 创建代理服务实例
   * @param {Object} options 配置选项
   * @param {string} options.PROXY_SERVER 代理服务器地址
   * @param {string} options.PROXY_OVERRIDE 代理例外列表
   */
  constructor(options = {}) {
    this.PROXY_SERVER = options.PROXY_SERVER;
    this.PROXY_OVERRIDE = options.PROXY_OVERRIDE;
  }

  /**
   * 清除系统代理
   */
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

  /**
   * 设置系统代理
   */
  async setSystemProxy() {
    try {
      const regKey = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
      });

      await this.setRegistryValue(regKey, 'ProxyEnable', Registry.REG_DWORD, 1);
      
      await this.setRegistryValue(regKey, 'ProxyServer', Registry.REG_SZ, this.PROXY_SERVER);
      
      await this.setRegistryValue(regKey, 'ProxyOverride', Registry.REG_SZ, this.PROXY_OVERRIDE);
      
      await this.refreshIESettings();
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 设置注册表值
   * @param {Object} regKey 注册表键
   * @param {string} name 名称
   * @param {string} type 类型
   * @param {any} value 值
   */
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

  /**
   * 刷新IE设置
   */
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

module.exports = ProxyService;