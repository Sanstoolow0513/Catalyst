import path from "path";
import axios from "axios";
import process from "process";
import yaml from "js-yaml";
import AdmZip from "adm-zip";
import { fileURLToPath } from "url";
import { readFile, writeFile, mkdir } from "fs/promises";
import { spawn } from "child_process";

class ClashMS {
  constructor(options = {}) {
    this.urlFilePath = options.urlFilePath;
    this.configFilePath = options.configFilePath;
    this.clashCorePath = options.clashCorePath;
    this.currentYaml = null;
    this.PROXY_SERVER = options.PROXY_SERVER;
    this.PROXY_OVERRIDE = options.PROXY_OVERRIDE;
    console.log("user.clashMS");
  }
  /**
   * ! init 方法
   */
  async initialize() {
    console.log(this.urlFilePath);
    console.log(this.configFilePath);
    // await this.fetchConfig(this.urlFilePath, this.configFilePath);
    await this.downloadMihomoCore(this.clashCorePath);
  }

  /**
   * todos  这里我修改了逻辑：选择部分作为异步控制
   * @param {*} urlFilePath
   * @param {*} yamlFilePath
   * @returns
   */
  async fetchConfig(urlFilePath, configFilePath) {
    try {
      // 读取URL列表文件
      const urlListContent = await readFile(urlFilePath, "utf-8");
      const availableUrls = urlListContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (availableUrls.length === 0) {
        console.error("No url.txt document");
        return;
      }
      const encodedUrlHash = Buffer.from(urlListContent)
        .toString("base64")
        .replace(/[\\/:*?"<>|]/g, "_");
      const configDirectory = path.join(configFilePath, encodedUrlHash);
      const downloadedConfigPath = path.join(configDirectory, "config.yaml");
      this.currentYaml = downloadedConfigPath;
      console.log("now yaml:", this.currentYaml);
      // await mkdir(configDirectory, { recursive: true });
      // const response = await axios.get(configUrl, { responseType: "text" });
      // await writeFile(downloadedConfigPath, response.data);

      // console.log("配置文件已成功保存到", downloadedConfigPath);
      // return downloadedConfigPath;
    } catch (error) {
      console.error("获取配置文件时发生错误:", error.message);
      throw error;
    }
  }
  /**
   * @param {string} 上级目录
   * @returns {Promise<void>}
   */
  async downloadMihomoCore(targetPath) {
    const version = "v1.19.10";
    const platform = process.platform;
    const arch = process.arch;
    const zipFilePath = path.join(path.dirname(targetPath), "mihomo.zip");

    let downloadUrl = `https://github.com/MetaCubeX/mihomo/releases/download/${version}/mihomo-windows-amd64-${version}.zip`;
    console.log(`正在从 ${downloadUrl} 下载 mihomo 核心...`);
    try {
      const response = await axios.get(downloadUrl, {
        responseType: "arraybuffer",
      });
      // await writeFile(gzFilePath, Buffer.from(response.data));
      await writeFile(zipFilePath, Buffer.from(response.data));
      // console.log(`mihomo 核心已成功下载到 ${gzFilePath}`);
      console.log(`mihomo 核心已成功下载到 ${zipFilePath}`);
      console.log("正在解压 mihomo 核心...");
      // await decompressGzFile(gzFilePath, targetPath);
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(path.dirname(targetPath), true);
      console.log(`mihomo 核心已成功解压到 ${targetPath}`);
    } catch (error) {
      console.error("下载 mihomo 核心时发生错误:", error.message);
      throw error;
    }
  }
  async clearSystemProxy() {
    return new Promise((resolve) => {
      console.log("ready to clear system proxy settings...");
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
        console.log(`[PowerShell]: ${data}`);
      });

      ps.stderr.on("data", (data) => {
        console.error(`[PowerShell error]: ${data}`);
      });

      ps.on("close", (code) => {
        if (code === 0) {
          console.log("PowerShell脚本执行成功");
          resolve(true);
        } else {
          console.error(`PowerShell脚本执行失败，退出码: ${code}`);
          resolve(false);
        }
      });
    });
  }

  async setSystemProxy() {
    console.log("ready to set system proxy settings...");
    return new Promise((resolve) => {
      const ps = spawn("powershell.exe", [
        "-Command",
        `
        # 设置输出编码为 UTF-8
        [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

        # 设置代理注册表项
        Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyEnable -value 1
        Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyServer -value "${PROXY_SERVER}"
        Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyOverride -value "${PROXY_OVERRIDE}"
        
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
        console.log(`[PowerShell]: ${data}`);
      });

      ps.stderr.on("data", (data) => {
        console.error(`[PowerShell error]: ${data}`);
      });

      ps.on("close", (code) => {
        if (code === 0) {
          console.log("PowerShell脚本执行成功");
          resolve(true);
        } else {
          console.error(`PowerShell脚本执行失败，退出码: ${code}`);
          resolve(false);
        }
      });
    });
  }

  async startMihomo() {
    const clashProcess = spawn(this.clashCorePath, [
      "-d",
      path.dirname(downloadedConfigPath),
    ]);
    console.log("Clash进程ID:", clashProcess.pid);

    clashProcess.stdout.on("data", (data) => {
      console.log(`[clash]: ${data.toString().trim()}`);
    });

    clashProcess.stderr.on("data", (data) => {
      console.error(`[clash error]: ${data.toString().trim()}`);
    });

    // 等待Clash启动
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

export default ClashMS;
