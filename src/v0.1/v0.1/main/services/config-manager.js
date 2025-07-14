const fs = require("fs");
const path = require("path");
const axios = require("axios");
const yaml = require("js-yaml");
const { mkdir, readFile, writeFile } = require("fs/promises");
const { config } = require("process");

class ConfigManager {
  /**
   * @param {string} options.configDir yaml-base-dir
   */
  constructor(options = {}) {
    this.userConfigPath = path.join(options.configDir, "config_sources.yaml");
  }

  async getUserConfig() {
    const config = fs.readFileSync(this.urlFilePath);
    const data = yaml.safeLoad(config);

    console.log(data);
    return data;
  }
  //承诺给用户的前端list加入一个结构 object
  async addUserConfig(setting, data) {
    const newYaml = yaml.dump(data, setting);
    fs.writeFileSync(this.userConfig);
  }

  getCurrentConfigPath() {
    return this.currentConfigPath;
  }

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

  async saveUrlToFile(url) {
    try {
      await writeFile(this.urlFilePath, url.trim() + "\n", "utf-8");
    } catch (error) {
      throw error;
    }
  }

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

module.exports = { ConfigManager };
