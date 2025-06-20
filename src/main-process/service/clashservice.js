const path = require("path");
const axios = require("axios");
const process = require("process");
const yaml = require("js-yaml");
const AdmZip = require("adm-zip");
const zlib = require("zlib");
const fs = require("fs");
// const { fileURLToPath } = require("url"); // Not needed in CJS
const { readFile, writeFile, mkdir, access } = require("fs/promises");
const { spawn } = require("child_process");
const readline = require("readline");

/**
 * Clash 管理服务，负责核心下载、配置管理、进程控制和系统代理设置
 * 提供节点选择、延迟测试和代理切换功能
 */
class ClashMS {
  /**
   * 创建 Clash 服务实例
   * @param {Object} options 配置选项
   * @param {string} options.urlFilePath URL 列表文件路径
   * @param {string} options.configBaseDir 配置基础目录
   * @param {string} options.clashCorePath Clash 核心路径
   * @param {string} options.PROXY_SERVER 代理服务器地址
   * @param {string} options.PROXY_OVERRIDE 代理例外列表
   */
  constructor(options = {}) {
    this.urlFilePath = options.urlFilePath;
    this.configBaseDir = options.configBaseDir;
    this.clashCorePath = options.clashCorePath;
    this.currentConfigPath = null;
    this.PROXY_SERVER = options.PROXY_SERVER;
    this.PROXY_OVERRIDE = options.PROXY_OVERRIDE;
    this.clashProcess = null;
    this.clashConfig = null;
    this.externalController = null;

    console.log("[ClashMS] 初始化", "service/clashservice.js");
  }

  /**
   * 解压 .gz 文件到指定路径
   * @param {string} gzFilePath - .gz 文件路径
   * @param {string} outputFilePath - 解压后的文件路径
   * @returns {Promise<void>}
   */
  async decompressGzFile(gzFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
      const input = fs.createReadStream(gzFilePath);
      const output = fs.createWriteStream(outputFilePath);
      const gunzip = zlib.createGunzip();

      input.pipe(gunzip).pipe(output);

      output.on("finish", () => {
        console.log(`[ClashMS] 文件已成功解压到 ${outputFilePath}`, "service/clashservice.js");
        resolve();
      });

      output.on("error", (error) => {
        console.error(`[ClashMS] 解压文件时发生错误: ${error.message}`, "service/clashservice.js");
        reject(error);
      });
    });
  }

  /**
   * 初始化服务：检查核心，下载配置
   * @returns {Promise<void>}
   */
   async initialize() {
     console.log(`[ClashMS.initialize] 初始化开始`, "service/clashservice.js");
     console.log(`[ClashMS.initialize] 调用堆栈:\n${new Error().stack}`, "service/clashservice.js");
     console.log(`[ClashMS.initialize] URL 文件路径: ${this.urlFilePath}`, "service/clashservice.js");
     console.log(`[ClashMS.initialize] 配置基础目录: ${this.configBaseDir}`, "service/clashservice.js");
     console.log(`[ClashMS.initialize] Clash 核心路径: ${this.clashCorePath}`, "service/clashservice.js");

    await this.checkAndDownloadCore();
    await this.downloadConfigFromUrlFile();
    if (this.currentConfigPath) {
      await this.loadConfig(this.currentConfigPath);
    }
  }

  /**
   * 检查并下载 Mihomo 核心
   */
  async checkAndDownloadCore() {
    console.log("[ClashMS] 检查 Mihomo 核心是否存在...", "service/clashservice.js");
    try {
      await access(this.clashCorePath);
      console.log("[ClashMS] 已找到 Mihomo 核心，跳过下载。", "service/clashservice.js");
    } catch (error) {
      console.log("[ClashMS] 未找到 Mihomo 核心，正在尝试下载...", "service/clashservice.js");
      try {
        await this.downloadMihomoCore(this.clashCorePath);
      } catch (downloadError) {
        console.error(
          `[ClashMS] 下载 Mihomo 核心失败: ${downloadError.message}`,
          "service/clashservice.js"
        );
        throw new Error("Mihomo 核心下载失败");
      }
    }
  }

  /**
   * 下载 Mihomo 核心
   * @param {string} targetPath - 核心保存路径
   * @returns {Promise<void>}
   */
  async downloadMihomoCore(targetPath) {
    const version = "v1.19.10";
    const zipFilePath = path.join(path.dirname(targetPath), "mihomo.zip");

    let downloadUrl = `https://github.com/MetaCubeX/mihomo/releases/download/${version}/mihomo-windows-amd64-${version}.zip`;
    console.log(`[ClashMS] 正在从 ${downloadUrl} 下载 mihomo 核心...`, "service/clashservice.js");
    try {
      const response = await axios.get(downloadUrl, {
        responseType: "arraybuffer",
      });
      await writeFile(zipFilePath, Buffer.from(response.data));
      console.log(`[ClashMS] mihomo 核心已成功下载到 ${zipFilePath}`, "service/clashservice.js");
      console.log("[ClashMS] 正在解压 mihomo 核心...", "service/clashservice.js");
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(path.dirname(targetPath), true);
      console.log(`[ClashMS] mihomo 核心已成功解压到 ${targetPath}`, "service/clashservice.js");
    } catch (error) {
      console.error(`[ClashMS] 下载 mihomo 核心时发生错误: ${error.message}`, "service/clashservice.js");
      throw error;
    }
  }

  /**
   * 从 URL 文件中读取 URL 并下载配置文件
   * @returns {Promise<string>} 下载的配置文件路径
   */
  async downloadConfigFromUrlFile() {
    try {
      const urlListContent = await readFile(this.urlFilePath, "utf-8");
      const availableUrls = urlListContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (availableUrls.length === 0) {
        console.error("[ClashMS] 未找到有效的配置文件URL，请检查url.txt文件", "service/clashservice.js");
        throw new Error("未找到有效的配置文件URL");
      }

      const selectedConfigUrl = availableUrls[0];
      console.log(`[ClashMS] 正在获取配置文件: ${selectedConfigUrl}`, "service/clashservice.js");

      const encodedUrlHash = Buffer.from(selectedConfigUrl)
        .toString("base64")
        .replace(/[\\/:*?"<>|]/g, "_");
      const configDirectory = path.join(this.configBaseDir, encodedUrlHash);
      const downloadedConfigPath = path.join(configDirectory, "config.yaml");

      await mkdir(configDirectory, { recursive: true });
      const response = await axios.get(selectedConfigUrl, { responseType: "text" });
      await writeFile(downloadedConfigPath, response.data);

      this.currentConfigPath = downloadedConfigPath;
      console.log(`[ClashMS] 配置文件已成功保存到 ${this.currentConfigPath}`, "service/clashservice.js");
      return this.currentConfigPath;
    } catch (error) {
      console.error(`[ClashMS] 获取配置文件时发生错误: ${error.message}`, "service/clashservice.js");
      throw error;
    }
  }

  /**
   * 加载并解析配置文件
   * @param {string} configPath - 配置文件路径
   * @returns {Promise<object>} 解析后的配置对象
   */
  async loadConfig(configPath) {
    try {
      const configContent = await readFile(configPath, "utf-8");
      this.clashConfig = yaml.load(configContent);
      this.externalController = this.clashConfig["external-controller"];
      console.log(`[ClashMS] 配置文件加载成功: ${configPath}`, "service/clashservice.js");
      console.log(`[ClashMS] 外部控制器: ${this.externalController}`, "service/clashservice.js");
      return this.clashConfig;
    } catch (error) {
      console.error(`[ClashMS] 加载或解析配置文件时发生错误: ${error.message}`, "service/clashservice.js");
      throw error;
    }
  }

  /**
   * 启动 Mihomo 进程
   * @returns {Promise<void>}
   */
  async startMihomo() {
    if (!this.currentConfigPath) {
      console.error("[ClashMS] 未指定配置文件路径，无法启动 Mihomo", "service/clashservice.js");
      throw new Error("未指定配置文件路径");
    }
    if (!this.clashCorePath) {
       console.error("[ClashMS] 未指定 Mihomo 核心路径，无法启动 Mihomo", "service/clashservice.js");
       throw new Error("未指定 Mihomo 核心路径");
    }
    if (this.clashProcess) {
        console.log("[ClashMS] Mihomo 进程已在运行", "service/clashservice.js");
        return;
    }

    console.log("[ClashMS] 启动 Mihomo 服务...", "service/clashservice.js");
    try {
      this.clashProcess = spawn(this.clashCorePath, [
        "-d",
        path.dirname(this.currentConfigPath),
      ]);
      console.log(`[ClashMS] Mihomo 进程ID: ${this.clashProcess.pid}`, "service/clashservice.js");

      this.clashProcess.stdout.on("data", (data) => {
        console.log(`[mihomo]: ${data.toString().trim()}`, "service/clashservice.js");
      });

      this.clashProcess.stderr.on("data", (data) => {
        console.error(`[mihomo error]: ${data.toString().trim()}`, "service/clashservice.js");
      });

      this.clashProcess.on("close", (code) => {
        console.log(`[ClashMS] Mihomo 进程退出，退出码: ${code}`, "service/clashservice.js");
        this.clashProcess = null; // Clear process reference on close
      });

      this.clashProcess.on("error", (error) => {
          console.error(`[ClashMS] 启动 Mihomo 进程失败: ${error.message}`, "service/clashservice.js");
          this.clashProcess = null;
      });

      // 等待Clash启动
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("[ClashMS] Mihomo 服务已启动", "service/clashservice.js");

    } catch (error) {
      console.error(`[ClashMS] 启动 Mihomo 进程时发生错误: ${error.message}`, "service/clashservice.js");
      throw error;
    }
  }

  /**
   * 停止 Mihomo 进程
   * @returns {Promise<void>}
   */
  async stopMihomo() {
      if (!this.clashProcess) {
          console.log("[ClashMS] Mihomo 进程未运行", "service/clashservice.js");
          return;
      }

      console.log("[ClashMS] 停止 Mihomo 服务...", "service/clashservice.js");
      return new Promise((resolve, reject) => {
          this.clashProcess.on("close", (code) => {
              console.log(`[ClashMS] Mihomo 进程已停止，退出码: ${code}`, "service/clashservice.js");
              this.clashProcess = null;
              resolve();
          });
          this.clashProcess.on("error", (error) => {
              console.error(`[ClashMS] 停止 Mihomo 进程失败: ${error.message}`, "service/clashservice.js");
              this.clashProcess = null;
              reject(error);
          });
          this.clashProcess.kill("SIGINT"); // Use SIGINT for graceful shutdown
      });
  }

  /**
   * 清除系统代理设置
   * @returns {Promise<boolean>}
   */
  async clearSystemProxy() {
    console.log("[ClashMS] 准备清除系统代理设置...", "service/clashservice.js");
    return new Promise((resolve) => {
      const ps = spawn("powershell.exe", [
        "-Command",
        `
        # 设置输出编码为 UTF-8
        [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

        # 禁用代理
        Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyEnable -value 0

        # 刷新代理设置
        $signature = @"
[DllImport("wininet.dll", SetLastError = true, CharSet=CharSet.Auto)]
public static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int lpdwBufferLength);
"@
        $type = Add-Type -MemberDefinition $signature -Name wininet -Namespace pinvoke -PassThru
        $null = $type::InternetSetOption([IntPtr]::Zero, 39, [IntPtr]::Zero, 0)  # 39 = INTERNET_OPTION_SETTINGS_CHANGED
        $null = $type::InternetSetOption([IntPtr]::Zero, 37, [IntPtr]::Zero, 0)  # 37 = INTERNET_OPTION_REFRESH
      `,
      ]);

      ps.stdout.on("data", (data) => {
        console.log(`[PowerShell]: ${data.toString().trim()}`, "service/clashservice.js");
      });

      ps.stderr.on("data", (data) => {
        console.error(`[PowerShell error]: ${data.toString().trim()}`, "service/clashservice.js");
      });

      ps.on("close", (code) => {
        if (code === 0) {
          console.log("[ClashMS] PowerShell脚本执行成功", "service/clashservice.js");
          resolve(true);
        } else {
          console.error(`[ClashMS] PowerShell脚本执行失败，退出码: ${code}`, "service/clashservice.js");
          resolve(false);
        }
      });
       ps.on("error", (error) => {
           console.error(`[ClashMS] 执行 PowerShell 脚本失败: ${error.message}`, "service/clashservice.js");
           resolve(false);
       });
    });
  }

  /**
   * 设置系统代理
   * @returns {Promise<boolean>}
   */
  async setSystemProxy() {
    console.log("[ClashMS] 准备设置系统代理...", "service/clashservice.js");
    return new Promise((resolve) => {
      const ps = spawn("powershell.exe", [
        "-Command",
        `
        # 设置输出编码为 UTF-8
        [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

        # 设置代理注册表项
        Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyEnable -value 1
        Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyServer -value "${this.PROXY_SERVER}"
        Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyOverride极 -value "${this.PROXY_OVERRIDE}"

        # 刷新代理设置
        $signature = @"
[DllImport("wininet.dll", SetLastError = true, CharSet=CharSet.Auto)]
public static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int lpdwBufferLength);
"@
        $type = Add-Type -MemberDefinition $signature -Name wininet -Namespace pinvoke -PassThru
        $null = $type::InternetSetOption([IntPtr]::Zero, 39, [IntPtr]::Zero, 0)  # 39 = INTERNET_OPTION_SETTINGS_CHANGED
        $null = $type::InternetSetOption([IntPtr]::Zero, 37, [IntPtr]::Zero, 0)  # 37 = INTERNET_OPTION_REFRESH
      `,
      ]);

      ps.stdout.on("data", (data) => {
        console.log(`[PowerShell]: ${data.toString().trim()}`, "service/clashservice.js");
      });

      ps.stderr.on("data", (data) => {
        console.error(`[PowerShell error]: ${data.toString().trim()}`, "service/clashservice.js");
      });

      ps.on("close", (code) => {
        if (code === 0) {
          console.log("[ClashMS] PowerShell脚本执行成功", "service/clashservice.js");
          resolve(true);
        } else {
          console.error(`[ClashMS] PowerShell脚本执行失败，退出码: ${code}`, "service/clashservice.js");
          resolve(false);
        }
      });
       ps.on("error", (error) => {
           console.error(`[ClashMS] 执行 PowerShell 脚本失败: ${error.message}`, "service/clashservice.js");
           resolve(false);
       });
    });
  }

  /**
   * 获取节点列表
   * @returns {Promise<Array<object>>} 节点信息数组
   */
  async getProxyList() {
      if (!this.clashConfig) {
          console.error("[ClashMS] 配置文件未加载，无法获取节点列表", "service/clashservice.js");
          return [];
      }

      const selectGroup = this.clashConfig["proxy-groups"]?.find(
        group => group.name === "🔰 选择节点"
      );

      if (!selectGroup) {
          console.log("[ClashMS] 未找到 '🔰 选择节点' 代理组", "service/clashservice.js");
          return [];
      }

      const proxiesInfo = [];
      for (const proxyName of selectGroup.proxies) {
        if (proxyName === "DIRECT") continue;

        const proxy = this.clashConfig.proxies?.find(
            (p) => p.name === proxyName
        );
        if (!proxy) continue;

        proxiesInfo.push({
            name: proxyName,
            server: proxy.server,
            // latency will be added by testProxyLatency
        });
      }
      return proxiesInfo;
  }

  /**
   * 测试节点延迟
   * @param {string} proxyName - 节点名称
   * @returns {Promise<number>} 延迟 (ms) 或 -1 (超时/错误)
   */
  async testProxyLatency(proxyName) {
      if (!this.externalController) {
          console.error("[ClashMS] 外部控制器地址未设置，无法测试节点延迟", "service/clashservice.js");
          return -1;
      }
      if (!this.clashConfig?.port) {
           console.error("[ClashMS] Clash 端口未设置，无法测试节点延迟", "service/clashservice.js");
           return -1;
      }

      try {
          const startTime = Date.now();
          // Use the Clash API to test latency
          const response = await axios.get(`http://${this.externalController}/proxies/${encodeURIComponent(proxyName)}/delay?url=http://www.gstatic.com/generate_204&timeout=5000`);
          const latency = response.data.delay;
          console.log(`[ClashMS] 节点 ${proxyName} 延迟: ${latency}ms`, "service/clashservice.js");
          return latency;
      } catch (error) {
          console.error(`[ClashMS] 测试节点 ${proxyName} 延迟时出错: ${error.message}`, "service/clashservice.js");
          return -1; // Indicate timeout or error
      }
  }

  /**
   * 切换节点
   * @param {string} proxyName - 要切换到的节点名称
   * @returns {Promise<void>}
   */
  async switchProxy(proxyName) {
      if (!this.externalController) {
          console.error("[ClashMS] 外部控制器地址未设置，无法切换节点", "service/clashservice.js");
          throw new Error("外部控制器地址未设置");
      }

      console.log(`[ClashMS] 正在切换到节点: ${proxyName}`, "service/clashservice.js");
      try {
          await axios.put(
              `http://${this.externalController}/proxies/🔰 选择节点`,
              {
                  name: proxyName,
              }
          );
          console.log("[ClashMS] 节点切换成功", "service/clashservice.js");
      } catch (error) {
          console.error(`[ClashMS] 切换节点 ${proxyName} 时出错: ${error.message}`, "service/clashservice.js");
          throw error;
      }
  }

  /**
   * 获取当前使用的节点
   * @returns {Promise<string|null>} 当前节点名称或 null
   */
  async getCurrentProxy() {
      if (!this.externalController) {
          console.error("[ClashMS] 外部控制器地址未设置，无法获取当前节点", "service/clashservice.js");
          return null;
      }

      try {
          const response = await axios.get(`http://${this.externalController}/proxies/🔰 选择节点`);
          return response.data.now;
      } catch (error) {
          console.error(`[ClashMS] 获取当前节点时出错: ${error.message}`, "service/clashservice.js");
          return null;
      }
  }

  /**
   * 交互式节点选择（控制台模式）
   * @returns {Promise<void>}
   */
  async interactiveProxySelection() {
    if (!this.externalController || !this.clashConfig?.port) {
      console.error("[ClashMS] 未初始化完成，无法进行节点选择", "service/clashservice.js");
      return;
    }

    try {
      const selectGroup = this.clashConfig["proxy-groups"]?.find(
        group => group.name === "🔰 选择节点"
      );

      if (!selectGroup) {
        console.log("[ClashMS] 未找到 '🔰 选择节点' 代理组", "service/clashservice.js");
        return;
      }

      console.log("\n节点列表：", "service/clashservice.js");
      const proxiesInfo = [];

      for (const proxyName of selectGroup.proxies) {
        if (proxyName === "DIRECT") continue;

        const latency = await this.testProxyLatency(proxyName);
        const status = latency >= 0 ? `${latency}ms` : "超时";
        console.log(`${proxyName} - ${status}`, "service/clashservice.js");
        proxiesInfo.push({ name: proxyName, latency });
      }

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const selectedIndex = await new Promise(resolve => {
        rl.question("\n请选择节点编号（输入0取消）: ", answer => {
          rl.close();
          resolve(parseInt(answer) - 1);
        });
      });

      if (selectedIndex >= 0 && selectedIndex < proxiesInfo.length) {
        await this.switchProxy(proxiesInfo[selectedIndex].name);
      }
    } catch (error) {
      console.error(`[ClashMS] 节点选择出错: ${error.message}`, "service/clashservice.js");
    }
  }
}

module.exports = ClashMS;
