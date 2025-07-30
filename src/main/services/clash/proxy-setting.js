const { exec } = require('child_process');
const Registry = require('winreg');
const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');

class ProxyManager {
  /**
   * 创建代理管理器实例
   */
  constructor() {
  }

  async clearSystemProxy() {
    logger.info('开始清除系统代理设置');

    try {
      // 在Windows系统上使用注册表设置代理
      const regKey = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
      });

      await this.setRegistryValue(regKey, 'ProxyEnable', Registry.REG_DWORD, 0);
      logger.debug('已设置ProxyEnable为0');
      
      await this.refreshIESettings();
      logger.debug('已刷新IE设置');
      
      logger.info('系统代理已成功清除');
      return true;
    } catch (error) {
      logger.error('清除系统代理时发生错误', { error: error.message, stack: error.stack });
      throw createError(error, 'ProxyManager.clearSystemProxy');
    }
  }

  async setSystemProxy(proxyServer, proxyOverride) {
    logger.info('开始设置系统代理', { proxyServer, proxyOverride });

    try {
      const regKey = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
      });

      await this.setRegistryValue(regKey, 'ProxyEnable', Registry.REG_DWORD, 1);
      logger.debug('已设置ProxyEnable为1');
      
      await this.setRegistryValue(regKey, 'ProxyServer', Registry.REG_SZ, proxyServer);
      logger.debug('已设置ProxyServer', { proxyServer });
      
      await this.setRegistryValue(regKey, 'ProxyOverride', Registry.REG_SZ, proxyOverride);
      logger.debug('已设置ProxyOverride', { proxyOverride });
      
      await this.refreshIESettings();
      logger.debug('已刷新IE设置');
      
      logger.info('系统代理设置成功');
      return true;
    } catch (error) {
      logger.error('设置系统代理时发生错误', { proxyServer, proxyOverride, error: error.message, stack: error.stack });
      throw createError(error, 'ProxyManager.setSystemProxy', { proxyServer, proxyOverride });
    }
  }

  setRegistryValue(regKey, name, type, value) {
    logger.debug('设置注册表值', { key: regKey.key, name, type, value });

    return new Promise((resolve, reject) => {
      regKey.set(name, type, value, (err) => {
        if (err) {
          logger.error('设置注册表值失败', { key: regKey.key, name, type, value, error: err.message });
          reject(err);
        } else {
          logger.debug('注册表值设置成功', { key: regKey.key, name, type, value });
          resolve();
        }
      });
    });
  }

  refreshIESettings() {
    logger.debug('开始刷新IE设置');

    return new Promise((resolve, reject) => {
      const command = 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxySettingsPerUser /t REG_DWORD /d 1 /f';
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error('刷新IE设置失败', { command, error: error.message, stderr });
          reject(error);
        } else {
          logger.debug('IE设置刷新成功', { stdout });
          resolve();
        }
      });
    });
  }
}

module.exports = { ProxyManager }; 