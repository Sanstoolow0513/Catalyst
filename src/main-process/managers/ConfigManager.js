/**
 * 配置管理类
 * 集中管理应用配置
 */
export default class ConfigManager {
  constructor() {
    // 默认配置
    this.config = {
      proxy: {
        server: "127.0.0.1:7890",
        override: "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*"
      },
      clash: {
        executable: "mihomo.exe",
        configPath: "url.txt"
      }
    };
  }

  /**
   * 获取配置项
   * @param {string} key - 配置路径 (如 'proxy.server')
   * @returns {any} 配置值
   */
  get(key) {
    return key.split('.').reduce((obj, k) => (obj || {})[k], this.config);
  }

  /**
   * 更新配置
   * @param {string} key - 配置路径
   * @param {any} value - 新值
   */
  set(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, k) => obj[k] = obj[k] || {}, this.config);
    target[lastKey] = value;
  }
}