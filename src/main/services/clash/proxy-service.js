const { exec } = require('child_process');
const Registry = require('winreg');
const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');

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
    logger.info('开始清除系统代理设置 (ProxyService)');

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
      
      logger.info('系统代理已成功清除 (ProxyService)');
      return true;
    } catch (error) {
      logger.error('清除系统代理时发生错误 (ProxyService)', { error: error.message, stack: error.stack });
      throw createError(error, 'ProxyService.clearSystemProxy');
    }
  }

  /**
   * 设置系统代理
   */
  async setSystemProxy() {
    logger.info('开始设置系统代理 (ProxyService)', { proxyServer: this.PROXY_SERVER, proxyOverride: this.PROXY_OVERRIDE });

    try {
      const regKey = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
      });

      await this.setRegistryValue(regKey, 'ProxyEnable', Registry.REG_DWORD, 1);
      logger.debug('已设置ProxyEnable为1');
      
      await this.setRegistryValue(regKey, 'ProxyServer', Registry.REG_SZ, this.PROXY_SERVER);
      logger.debug('已设置ProxyServer', { proxyServer: this.PROXY_SERVER });
      
      await this.setRegistryValue(regKey, 'ProxyOverride', Registry.REG_SZ, this.PROXY_OVERRIDE);
      logger.debug('已设置ProxyOverride', { proxyOverride: this.PROXY_OVERRIDE });
      
      await this.refreshIESettings();
      logger.debug('已刷新IE设置');
      
      logger.info('系统代理设置成功 (ProxyService)');
      return true;
    } catch (error) {
      logger.error('设置系统代理时发生错误 (ProxyService)', { proxyServer: this.PROXY_SERVER, proxyOverride: this.PROXY_OVERRIDE, error: error.message, stack: error.stack });
      throw createError(error, 'ProxyService.setSystemProxy', { proxyServer: this.PROXY_SERVER, proxyOverride: this.PROXY_OVERRIDE });
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
    logger.debug('设置注册表值 (ProxyService)', { key: regKey.key, name, type, value });

    return new Promise((resolve, reject) => {
      regKey.set(name, type, value, (err) => {
        if (err) {
          logger.error('设置注册表值失败 (ProxyService)', { key: regKey.key, name, type, value, error: err.message });
          reject(err);
        } else {
          logger.debug('注册表值设置成功 (ProxyService)', { key: regKey.key, name, type, value });
          resolve();
        }
      });
    });
  }

  /**
   * 刷新IE设置
   */
  refreshIESettings() {
    logger.debug('开始刷新IE设置 (ProxyService)');

    return new Promise((resolve, reject) => {
      const command = 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxySettingsPerUser /t REG_DWORD /d 1 /f';
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error('刷新IE设置失败 (ProxyService)', { command, error: error.message, stderr });
          reject(error);
        } else {
          logger.debug('IE设置刷新成功 (ProxyService)', { stdout });
          resolve();
        }
      });
    });
  }
}

module.exports = ProxyService;