import path from "path";
import axios from "axios";
import process from "process";
import yaml from "js-yaml";
import { fileURLToPath } from "url";
import { readFile, writeFile, mkdir } from "fs/promises";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 代理设置相关常量
const PROXY_SERVER = "127.0.0.1:7890";
const PROXY_OVERRIDE = "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*";

class ClashManager {
    constructor() {
        this.urlFilePath = path.join(__dirname, "url.txt");
        this.clashExecutablePath = path.join(__dirname, "mihomo.exe");
        this.clashProcess = null;
        this.currentConfig = null;
        this.currentConfigPath = null;
        this.proxyPort = 7890;
        this.externalController = "127.0.0.1:9090";
    }

    // 下载Clash配置文件
    async fetchConfig(configUrl) {
        try {
            const encodedUrlHash = Buffer.from(configUrl)
                .toString("base64")
                .replace(/[\\/:*?"<>|]/g, "_");
            const configDirectory = path.join(__dirname, encodedUrlHash);
            const downloadedConfigPath = path.join(configDirectory, "config.yaml");
            
            await mkdir(configDirectory, { recursive: true });
            const response = await axios.get(configUrl, { responseType: "text" });
            await writeFile(downloadedConfigPath, response.data);
            
            return downloadedConfigPath;
        } catch (error) {
            console.error("获取配置文件时发生错误:", error.message);
            throw error;
        }
    }

    // 清除系统代理
    async clearSystemProxy() {
        return new Promise((resolve) => {
            const ps = spawn("powershell.exe", [
                "-Command",
                `
                    Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyEnable -value 0
                    $signature = @"
[DllImport("wininet.dll", SetLastError = true, CharSet=CharSet.Auto)]
public static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int lpdwBufferLength);
"@
                    $type = Add-Type -MemberDefinition $signature -Name wininet -Namespace pinvoke -PassThru
                    $null = $type::InternetSetOption([IntPtr]::Zero, 39, [IntPtr]::Zero, 0)
                    $null = $type::InternetSetOption([IntPtr]::Zero, 37, [IntPtr]::Zero, 0)
                `,
            ]);

            ps.on("close", (code) => {
                resolve(code === 0);
            });
        });
    }

    // 设置系统代理
    async setSystemProxy() {
        return new Promise((resolve) => {
            const ps = spawn("powershell.exe", [
                "-Command",
                `
                    Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyEnable -value 1
                    Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyServer -value "${PROXY_SERVER}"
                    Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyOverride -value "${PROXY_OVERRIDE}"
                    $signature = @"
[DllImport("wininet.dll", SetLastError = true, CharSet=CharSet.Auto)]
public static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int lpdwBufferLength);
"@
                    $type = Add-Type -MemberDefinition $signature -Name wininet -Namespace pinvoke -PassThru
                    $null = $type::InternetSetOption([IntPtr]::Zero, 39, [IntPtr]::Zero, 0)
                    $null = $type::InternetSetOption([IntPtr]::Zero, 37, [IntPtr]::Zero, 0)
                `,
            ]);

            ps.on("close", (code) => {
                resolve(code === 0);
            });
        });
    }

    // 获取可用URL列表
    async getAvailableUrls() {
        try {
            const urlListContent = await readFile(this.urlFilePath, "utf-8");
            return urlListContent
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
        } catch (error) {
            console.error("读取URL列表失败:", error.message);
            return [];
        }
    }

    // 启动Clash服务
    async startClash(configUrl) {
        try {
            if (this.clashProcess) {
                throw new Error("Clash已经在运行");
            }

            // 下载配置文件
            this.currentConfigPath = await this.fetchConfig(configUrl);
            
            // 读取并解析配置文件
            const configContent = await readFile(this.currentConfigPath, "utf-8");
            this.currentConfig = yaml.load(configContent);
            this.proxyPort = this.currentConfig.port || 7890;
            this.externalController = this.currentConfig["external-controller"] || "127.0.0.1:9090";

            // 启动Clash进程
            this.clashProcess = spawn(this.clashExecutablePath, ["-d", path.dirname(this.currentConfigPath)]);
            
            // 等待Clash启动
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            // 设置系统代理
            const proxySetSuccess = await this.setSystemProxy();
            
            if (!proxySetSuccess) {
                throw new Error("代理设置失败");
            }

            return {
                success: true,
                message: "Clash启动成功",
                port: this.proxyPort,
                controller: this.externalController
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // 停止Clash服务
    async stopClash() {
        if (this.clashProcess) {
            this.clashProcess.kill("SIGINT");
            this.clashProcess = null;
        }
        
        await this.clearSystemProxy();
        return { success: true, message: "Clash已停止" };
    }

    // 测试节点延迟
    async testNodeLatency(proxyName) {
        try {
            const proxy = this.currentConfig.proxies.find(p => p.name === proxyName);
            if (!proxy) {
                throw new Error("节点未找到");
            }
            
            const startTime = Date.now();
            await axios.get("http://www.gstatic.com/generate_204", {
                proxy: {
                    host: "127.0.0.1",
                    port: this.proxyPort
                },
                timeout: 5000
            });
            
            return Date.now() - startTime;
        } catch (error) {
            return -1;
        }
    }

    // 获取节点列表
    getNodeList() {
        if (!this.currentConfig) return [];
        
        const selectGroup = this.currentConfig["proxy-groups"]?.find(
            group => group.name === "🔰 选择节点"
        );
        
        if (!selectGroup) return [];
        
        return selectGroup.proxies
            .filter(name => name !== "DIRECT")
            .map(name => {
                const proxy = this.currentConfig.proxies.find(p => p.name === name);
                return {
                    name,
                    server: proxy?.server || "",
                    type: proxy?.type || ""
                };
            });
    }

    // 切换节点
    async switchNode(nodeName) {
        try {
            if (!this.currentConfig) {
                throw new Error("配置未加载");
            }
            
            await axios.put(`http://${this.externalController}/proxies/🔰 选择节点`, {
                name: nodeName
            });
            
            return { success: true, message: `已切换到节点: ${nodeName}` };
        } catch (error) {
            return {
                success: false,
                message: `节点切换失败: ${error.message}`
            };
        }
    }
}

export const clashManager = new ClashManager();