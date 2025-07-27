const fs = require("fs");
const path = require("path");
const axios = require("axios");
const yaml = require("js-yaml");
const { mkdir, readFile, writeFile } = require("fs/promises");

class ClashConfigService {
  /**
   * 创建 Clash 配置服务实例
   * @param {Object} options 配置选项
   * @param {string} options.configBaseDir 配置基础目录
   */
  constructor(options = {}) {
    this.configBaseDir = options.configBaseDir;
    this.urlFilePath = path.join(options.configDir, "config_sources.yaml");
    this.currentConfigPath = null;
  }

  /**
   * 获取当前配置路径
   * @returns {string|null} 当前配置文件路径
   */
  getCurrentConfigPath() {
    return this.currentConfigPath;
  }

  /**
   * 从URL下载配置
   */
  async downloadConfigFromUrl() {
    try {
      await mkdir(this.configBaseDir, { recursive: true });
      try {
        await fs.promises.access(this.urlFilePath);
      } catch (err) {}

      const urlListContent = await readFile(this.urlFilePath, "utf-8");
      const availableUrls = urlListContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (availableUrls.length === 0) {
        throw new Error("未找到有效的配置文件URL");
      }

      const selectedConfigUrl = availableUrls[0];

      // 为URL创建一个唯一的目录名
      const encodedUrlHash = Buffer.from(selectedConfigUrl)
        .toString("base64")
        .replace(/[\\/:*?"<>|]/g, "_");
      const configDirectory = path.join(this.configBaseDir, encodedUrlHash);
      const downloadedConfigPath = path.join(configDirectory, "config.yaml");

      await mkdir(configDirectory, { recursive: true });

      const response = await axios.get(selectedConfigUrl, {
        responseType: "text",
        timeout: 10000, // 10秒超时
      });
      await writeFile(downloadedConfigPath, response.data);

      this.currentConfigPath = downloadedConfigPath;
      return this.currentConfigPath;
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        throw new Error("获取配置文件超时，请检查URL是否有效。");
      }
      throw error;
    }
  }

  /**
   * 加载配置文件
   * @param {string} configPath 配置文件路径
   */
  async loadConfig(configPath) {
    try {
      const configContent = await readFile(configPath, "utf-8");
      const config = yaml.load(configContent);
      return config;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 保存用户配置
   * @param {Object} config 配置对象
   */
  async saveUserConfig(config) {
    try {
      const yamlContent = yaml.dump(config);
      await writeFile(this.urlFilePath, yamlContent, "utf-8");
    } catch (error) {
      throw error;
    }
  }

  /**
   * 保存URL到文件
   * @param {string} url URL
   */
  async saveUrlToFile(url) {
    try {
      await writeFile(this.urlFilePath, url.trim() + "\n", "utf-8");
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取URL列表
   * @returns {Array<string>} URL列表
   */
  async getUrlList() {
    try {
      const content = await readFile(this.urlFilePath, "utf-8");
      return content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    } catch (error) {
      return [];
    }
  }
}

module.exports = ClashConfigService;