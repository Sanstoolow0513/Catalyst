const { exec } = require('child_process');
const Registry = require('winreg');

/**
 * 系统代理管理类，负责设置和清除系统代理
 */
class ProxyManager {
  /**
   * 创建代理管理器实例
   */
  constructor() {
    console.log('[ProxyManager] 初始化完成');
  }

  /**
   * 清除系统代理设置
   * @returns {Promise<boolean>} 是否成功清除代理
   */
  async clearSystemProxy() {
    console.log('[ProxyManager] 清除系统代理');
    
    try {
      // 在Windows系统上使用注册表设置代理
      const regKey = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
      });

      // 禁用代理
      await this.setRegistryValue(regKey, 'ProxyEnable', Registry.REG_DWORD, 0);
      
      // 刷新系统设置
      await this.refreshIESettings();
      
      console.log('[ProxyManager] 系统代理已成功清除');
      return true;
    } catch (error) {
      console.error(`[ProxyManager] 清除系统代理失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 设置系统代理
   * @param {string} proxyServer - 代理服务器地址
   * @param {string} proxyOverride - 代理例外列表
   * @returns {Promise<boolean>} 是否成功设置代理
   */
  async setSystemProxy(proxyServer, proxyOverride) {
    console.log(`[ProxyManager] 设置系统代理: ${proxyServer}`);
    
    try {
      const regKey = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
      });

      // 启用代理
      await this.setRegistryValue(regKey, 'ProxyEnable', Registry.REG_DWORD, 1);
      
      // 设置代理服务器地址
      await this.setRegistryValue(regKey, 'ProxyServer', Registry.REG_SZ, proxyServer);
      
      // 设置不使用代理的地址
      await this.setRegistryValue(regKey, 'ProxyOverride', Registry.REG_SZ, proxyOverride);
      
      // 刷新系统设置
      await this.refreshIESettings();
      
      console.log('[ProxyManager] 系统代理已成功设置');
      return true;
    } catch (error) {
      console.error(`[ProxyManager] 设置系统代理失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 设置注册表值
   * @private
   * @param {Registry} regKey - 注册表键
   * @param {string} name - 值名称
   * @param {string} type - 值类型
   * @param {any} value - 值
   * @returns {Promise<void>}
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
   * 刷新IE设置以应用代理更改
   * @private
   * @returns {Promise<void>}
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

module.exports = { ProxyManager }; 