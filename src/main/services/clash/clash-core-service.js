const path = require("path");
const axios = require("axios");
const AdmZip = require("adm-zip");
const fs = require("fs");
const { writeFile, access } = require("fs/promises");
const { spawn } = require("child_process");

class ClashCoreService {
  /**
   * 创建 Clash 核心服务实例
   * @param {Object} options 配置选项
   * @param {string} options.clashCorePath Clash 核心路径
   */
  constructor(options = {}) {
    this.clashCorePath = options.clashCorePath;
    this.clashProcess = null;
  }

  /**
   * 检查并下载核心
   */
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

  /**
   * 下载Mihomo核心
   * @param {string} targetPath 目标路径
   */
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

  /**
   * 启动Mihomo
   * @param {string} configPath 配置文件路径
   */
  async startMihomo(configPath) {
    if (!configPath) {
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
        path.dirname(configPath),
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

  /**
   * 停止Mihomo
   */
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
}

module.exports = ClashCoreService;