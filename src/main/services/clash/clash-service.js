const path = require("path");
const axios = require("axios");
const yaml = require("js-yaml");
const AdmZip = require("adm-zip");
const zlib = require("zlib");
const fs = require("fs");
const { readFile, writeFile, access } = require("fs/promises");
const { spawn } = require("child_process");
const { ProxyManager } = require("./proxy-setting");
const { ConfigManager } = require("../config-manager");

class ClashService {
  /**
   * 创建 Clash 服务实例
   * @param {Object} options 配置选项
   * @param {string} options.configBaseDir 配置基础目录
   * @param {string} options.clashCorePath Clash 核心路径
   * @param {string} options.PROXY_SERVER 代理服务器地址
   * @param {string} options.PROXY_OVERRIDE 代理例外列表
   */
  constructor(options = {}, mainWindow) {
    this.mainWindow = mainWindow;
    this.configBaseDir = options.configBaseDir;
    this.clashCorePath = options.clashCorePath;
    this.currentConfigPath = null;
    this.PROXY_SERVER = options.PROXY_SERVER;
    this.PROXY_OVERRIDE = options.PROXY_OVERRIDE;
    this.clashProcess = null;
    this.clashConfig = null;
    this.externalController = null;

    this.proxyManager = new ProxyManager(options);
    this.configManager = new ConfigManager(options);
  }

  async decompressGzFile(gzFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
      const input = fs.createReadStream(gzFilePath);
      const output = fs.createWriteStream(outputFilePath);
      const gunzip = zlib.createGunzip();

      input.pipe(gunzip).pipe(output);

      output.on("finish", () => {
        resolve();
      });

      output.on("error", (error) => {
        reject(error);
      });
    });
  }

  async initialize() {
    try {
      await this.checkAndDownloadCore();
      await this.ensureConfigIsLoaded();
    } catch (error) {
      throw error;
    }
  }

  async ensureConfigIsLoaded() {
    if (this.clashConfig) {
      return;
    }

    await this.configManager.downloadConfigFromUrl();
    this.currentConfigPath = this.configManager.getCurrentConfigPath();

    if (this.currentConfigPath) {
      await this.loadConfig(this.currentConfigPath);
    }

    if (!this.clashConfig) {
      throw new Error("无法加载或找到有效的配置文件。");
    }
  }

  async checkAndDownloadCore() {
    try {
      await access(this.clashCorePath);
    } catch (error) {
      try {
        await this.downloadMihomoCore(this.clashCorePath);
      } catch (downloadError) {
        throw new Error("Mihomo 核心下载失败");
      }
    }
  }

  async downloadMihomoCore(targetPath) {
    const version = "v1.19.10";
    const zipFilePath = path.join(path.dirname(targetPath), "mihomo.zip");

    let downloadUrl = `https://github.com/MetaCubeX/mihomo/releases/download/${version}/mihomo-windows-amd64-${version}.zip`;
    try {
      const response = await axios.get(downloadUrl, {
        responseType: "arraybuffer",
      });
      await writeFile(zipFilePath, Buffer.from(response.data));
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(path.dirname(targetPath), true);
    } catch (error) {
      throw error;
    }
  }

  async loadConfig(configPath) {
    try {
      const configContent = await readFile(configPath, "utf-8");
      this.clashConfig = yaml.load(configContent);
      this.externalController = this.clashConfig["external-controller"];
      return this.clashConfig;
    } catch (error) {
      throw error;
    }
  }

  async startMihomo() {
    if (!this.currentConfigPath) {
      throw new Error("未指定配置文件路径");
    }
    if (!this.clashCorePath) {
      throw new Error("未指定 Mihomo 核心路径");
    }
    if (this.clashProcess) {
      return;
    }

    try {
      this.clashProcess = spawn(this.clashCorePath, [
        "-d",
        path.dirname(this.currentConfigPath),
      ]);

      this.clashProcess.stdout.on("data", (data) => {});

      this.clashProcess.on("close", (code) => {
        this.clashProcess = null;
      });

      this.clashProcess.on("error", (error) => {
        this.clashProcess = null;
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      throw error;
    }
  }

  async stopMihomo() {
    if (!this.clashProcess) {
      return;
    }

    try {
      this.clashProcess.kill("SIGTERM");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (this.clashProcess && !this.clashProcess.killed) {
        this.clashProcess.kill("SIGKILL");
      }
    } catch (error) {
      throw error;
    } finally {
      this.clashProcess = null;
    }
  }

  async clearSystemProxy() {
    return await this.proxyManager.clearSystemProxy();
  }

  async setSystemProxy() {
    return await this.proxyManager.setSystemProxy(
      this.PROXY_SERVER,
      this.PROXY_OVERRIDE
    );
  }

  async getProxyList() {
    await this.ensureConfigIsLoaded();

    const proxyGroups = this.clashConfig["proxy-groups"];
    if (!proxyGroups || !Array.isArray(proxyGroups)) {
      return [];
    }

    const result = proxyGroups
      .filter((group) => group.type === "select" || group.type === "selector")
      .map((group) => ({
        name: group.name,
        type: group.type,
        current: group.proxies ? group.proxies[0] || "" : "",
        options: group.proxies || [],
      }));

    if (this.clashProcess && this.externalController) {
      try {
        const url = `http://${this.externalController}/proxies`;
        const response = await axios.get(url, { timeout: 2000 });
        const liveProxies = response.data.proxies;

        for (const group of result) {
          if (liveProxies[group.name] && liveProxies[group.name].now) {
            group.current = liveProxies[group.name].now;
          }
        }
      } catch (e) {}
    }

    return result;
  }

  async testProxyLatency(proxyName) {
    if (!this.externalController) {
      throw new Error("未配置外部控制器地址");
    }

    try {
      const url = `http://${
        this.externalController
      }/proxies/${encodeURIComponent(proxyName)}/delay`;
      const params = {
        timeout: 5000,
        url: "http://www.gstatic.com/generate_204",
      };
      const response = await axios.get(url, { params });
      return response.data.delay;
    } catch (error) {
      return -1;
    }
  }

  async switchProxy(groupName, proxyName) {
    if (!this.externalController) {
      throw new Error("未配置外部控制器地址");
    }

    try {
      const url = `http://${
        this.externalController
      }/proxies/${encodeURIComponent(groupName)}`;
      await axios.put(url, { name: proxyName });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getCurrentProxy(groupName) {
    if (!this.externalController) {
      throw new Error("未配置外部控制器地址");
    }

    try {
      const url = `http://${
        this.externalController
      }/proxies/${encodeURIComponent(groupName)}`;
      const response = await axios.get(url);
      return response.data.now;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ClashService;
