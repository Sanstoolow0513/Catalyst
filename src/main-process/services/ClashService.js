/* 模块导入 */
import path from "path";
import axios from "axios";
import yaml from "js-yaml";
import { fileURLToPath } from "url";
import { readFile, writeFile, mkdir } from "fs/promises";
import { spawn } from "child_process";

/**
 * Clash核心服务类
 * 负责Clash代理的启动、停止和节点管理
 */
export default class ClashService {
  constructor(config) {
    // 初始化配置
    this.config = config;
    
    // 文件路径处理
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // 路径配置
    this.urlFilePath = path.join(__dirname, "url.txt");
    this.clashExecutablePath = path.join(__dirname, "mihomo.exe");
    
    // 运行时状态
    this.clashProcess = null;
    this.currentConfig = null;
    this.currentConfigPath = null;
    
    // 代理配置
    this.proxyServer = this.config.proxyServer || "127.0.0.1:7890";
    this.proxyOverride = this.config.proxyOverride || "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*";
  }

  // ... 保留原有方法 ...

    /* 配置文件下载 */
    async fetchConfig(configUrl) {
        try {
            // URL编码处理
            const encodedUrlHash = Buffer.from(configUrl)
                .toString("base64")
                .replace(/[\\/:*?"<>|]/g, "_");
            // 创建配置目录
            const configDirectory = path.join(__dirname, encodedUrlHash);
            // 下载路径定义
            const downloadedConfigPath = path.join(configDirectory, "config.yaml");
            
            // 创建目录并下载配置
            await mkdir(configDirectory, { recursive: true });
            const response = await axios.get(configUrl, { responseType: "text" });
            await writeFile(downloadedConfigPath, response.data);
            
            return downloadedConfigPath;
        } catch (error) {
            console.error("配置下载失败:", error.message);
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
                    Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyServer -value "${this.proxyServer}"
                    Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyOverride -value "${this.proxyOverride}"
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

    /* Clash服务启动 */
    async startClash(configUrl) {
        try {
            // 检查是否已运行
            if (this.clashProcess) {
                throw new Error("Clash已经在运行");
            }
            
            // 下载配置文件
            this.currentConfigPath = await this.fetchConfig(configUrl);
            
            // 读取并解析配置
            const configContent = await readFile(this.currentConfigPath, "utf-8");
            this.currentConfig = yaml.load(configContent);
            // 设置代理端口
            this.proxyPort = this.currentConfig.port || 7890;
            // 设置外部控制器地址
            this.externalController = this.currentConfig["external-controller"] || "127.0.0.1:9090";
            
            // 启动Clash进程
            this.clashProcess = spawn(this.clashExecutablePath, ["-d", path.dirname(this.currentConfigPath)]);
            
            // 筛选配置目录
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            // 配置系统代理
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

    /* Clash服务停止 */
    async stopClash() {
        // 终止进程
        if (this.clashProcess) {
            this.clashProcess.kill("SIGINT");
            this.clashProcess = null;
        }
        
        // 清除系统代理
        await this.clearSystemProxy();
        return { success: true, message: "Clash已停止" };
    }

    /* 节点延迟测试 */
    async testNodeLatency(proxyName) {
        try {
            // 获取指定节点
            const proxy = this.currentConfig.proxies.find(p => p.name === proxyName);
            if (!proxy) {
                throw new Error("节点未找到");
            }
            
            // 记录开始时间
            const startTime = Date.now();
            // 发送测试请求
            await axios.get("http://www.gstatic.com/generate_204", {
                proxy: {
                    host: "127.0.0.1",
                    port: this.proxyPort
                },
                timeout: 5000
            });
            
            // 返回延迟时间
            return Date.now() - startTime;
        } catch (error) {
            return -1; // 测试失败返回-1
        }
    }

    /* 节点列表获取 */
    getNodeList() {
        // 检查配置是否存在
        if (!this.currentConfig) return [];
        
        // 查找选择节点组
        const selectGroup = this.currentConfig["proxy-groups"]?.find(
            group => group.name === "🔰 选择节点"
        );
        
        // 未找到节点组返回空数组
        if (!selectGroup) return [];
        
        // 返回过滤后的节点列表
        return selectGroup.proxies
            .filter(name => name !== "DIRECT") // 排除DIRECT节点
            .map(name => {
                // 查找对应代理配置
                const proxy = this.currentConfig.proxies.find(p => p.name === name);
                return {
                    name, // 节点名称
                    server: proxy?.server || "", // 服务器地址
                    type: proxy?.type || "" // 节点类型
                };
            });
    }

    /* 节点切换 */
    async switchNode(nodeName) {
        try {
            // 检查配置是否加载
            if (!this.currentConfig) {
                throw new Error("配置未加载");
            }
            
            // 发送切换请求
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
