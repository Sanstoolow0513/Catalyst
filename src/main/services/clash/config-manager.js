const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { mkdir, readFile, writeFile } = require('fs/promises');

/**
 * Clash配置管理类，负责配置文件的获取和管理
 */
class ConfigManager {
  /**
   * 创建配置管理器实例
   * @param {Object} options 配置选项
   * @param {string} options.configBaseDir 配置文件基础目录
   */
  constructor(options = {}) {
    this.configBaseDir = options.configBaseDir;
    this.currentConfigPath = null;
    this.urlFilePath = path.join(options.configBaseDir, 'url.txt');
    
    console.log('[ConfigManager] 初始化完成');
    console.log(`[ConfigManager] 配置基础目录: ${this.configBaseDir}`);
  }

  /**
   * 获取当前配置路径
   * @returns {string|null} 当前配置路径
   */
  getCurrentConfigPath() {
    return this.currentConfigPath;
  }

  /**
   * 从URL文件中读取URL并下载配置文件
   * @returns {Promise<string>} 下载的配置文件路径
   */
  async downloadConfigFromUrl() {
    try {
      // 确保配置目录存在
      await mkdir(this.configBaseDir, { recursive: true });
      
      // 如果URL文件不存在，创建默认文件
      try {
        await fs.promises.access(this.urlFilePath);
      } catch (err) {
        console.log(`[ConfigManager] URL文件不存在，创建默认文件: ${this.urlFilePath}`);
        await writeFile(
          this.urlFilePath,
          'https://example.com/clash-config.yaml\n', 
          'utf-8'
        );
      }
      
      // 读取URL列表
      const urlListContent = await readFile(this.urlFilePath, 'utf-8');
      const availableUrls = urlListContent
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (availableUrls.length === 0) {
        console.error('[ConfigManager] 未找到有效的配置文件URL，请检查url.txt文件');
        throw new Error('未找到有效的配置文件URL');
      }

      const selectedConfigUrl = availableUrls[0];
      console.log(`[ConfigManager] 正在获取配置文件: ${selectedConfigUrl}`);

      // 为URL创建一个唯一的目录名
      const encodedUrlHash = Buffer.from(selectedConfigUrl)
        .toString('base64')
        .replace(/[\\/:*?"<>|]/g, '_');
      const configDirectory = path.join(this.configBaseDir, encodedUrlHash);
      const downloadedConfigPath = path.join(configDirectory, 'config.yaml');

      // 创建配置目录
      await mkdir(configDirectory, { recursive: true });
      
      // 下载配置文件，设置10秒超时
      const response = await axios.get(selectedConfigUrl, {
        responseType: 'text',
        timeout: 10000, // 10秒超时
      });
      await writeFile(downloadedConfigPath, response.data);

      this.currentConfigPath = downloadedConfigPath;
      console.log(`[ConfigManager] 配置文件已成功保存到 ${this.currentConfigPath}`);
      return this.currentConfigPath;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('[ConfigManager] 获取配置文件超时，请检查URL是否有效以及网络连接。');
        throw new Error('获取配置文件超时，请检查URL是否有效。');
      }
      console.error(`[ConfigManager] 获取配置文件时发生错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 保存URL到URL文件
   * @param {string} url - 要保存的URL
   * @returns {Promise<void>}
   */
  async saveUrlToFile(url) {
    try {
      await writeFile(this.urlFilePath, url.trim() + '\n', 'utf-8');
      console.log(`[ConfigManager] URL已保存到文件: ${this.urlFilePath}`);
    } catch (error) {
      console.error(`[ConfigManager] 保存URL到文件时发生错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取URL列表
   * @returns {Promise<string[]>} URL列表
   */
  async getUrlList() {
    try {
      const content = await readFile(this.urlFilePath, 'utf-8');
      return content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    } catch (error) {
      console.error(`[ConfigManager] 读取URL列表时发生错误: ${error.message}`);
      return [];
    }
  }
}

module.exports = { ConfigManager }; 