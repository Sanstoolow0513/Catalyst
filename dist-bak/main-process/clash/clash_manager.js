import path from "path";
import axios from "axios";
import yaml from "js-yaml";
import { fileURLToPath } from "url";
import { readFile, writeFile, mkdir } from "fs/promises";
import { spawn } from "child_process";
import { SystemProxyService } from './system_proxy_service';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class ClashManager {
    urlFilePath;
    clashExecutablePath;
    clashProcess = null;
    currentConfig = null;
    currentConfigPath = null;
    proxyPort = 7890;
    externalController = "127.0.0.1:9090";
    proxyService;
    constructor() {
        this.urlFilePath = path.join(__dirname, "url.txt");
        this.clashExecutablePath = path.join(__dirname, "mihomo.exe");
        this.proxyService = new SystemProxyService();
    }
    async fetchConfig(configUrl) {
        try {
            const encodedUrlHash = Buffer.from(configUrl)
                .toString("base64")
                .replace(/[\\/:*?"<>|]/g, "_");
            const configDirectory = path.join(__dirname, encodedUrlHash);
            const downloadedConfigPath = path.join(configDirectory, "config.yaml");
            await mkdir(configDirectory, { recursive: true });
            const response = await axios.get(configUrl, {
                responseType: "text"
            });
            await writeFile(downloadedConfigPath, response.data);
            return downloadedConfigPath;
        }
        catch (error) {
            console.error("配置下载失败:", error.message);
            throw error;
        }
    }
    async startClash(configUrl) {
        try {
            if (this.clashProcess) {
                throw new Error("Clash已经在运行");
            }
            this.currentConfigPath = await this.fetchConfig(configUrl);
            const configContent = await readFile(this.currentConfigPath, "utf-8");
            this.currentConfig = yaml.load(configContent);
            this.proxyPort = this.currentConfig.port || 7890;
            this.externalController = this.currentConfig['external-controller'] || "127.0.0.1:9090";
            this.clashProcess = spawn(this.clashExecutablePath, [
                "-d",
                path.dirname(this.currentConfigPath)
            ]);
            await new Promise(resolve => setTimeout(resolve, 2000));
            const proxySetSuccess = await this.proxyService.setSystemProxy(`127.0.0.1:${this.proxyPort}`);
            if (!proxySetSuccess) {
                throw new Error("代理设置失败");
            }
            return {
                success: true,
                message: "Clash启动成功",
                port: this.proxyPort,
                controller: this.externalController
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    async stopClash() {
        if (this.clashProcess) {
            this.clashProcess.kill("SIGINT");
            this.clashProcess = null;
        }
        await this.proxyService.clearSystemProxy();
        return {
            success: true,
            message: "Clash已停止"
        };
    }
    async testNodeLatency(proxyName) {
        try {
            if (!this.currentConfig?.proxies)
                return -1;
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
        }
        catch (error) {
            return -1;
        }
    }
    getNodeList() {
        if (!this.currentConfig)
            return [];
        const selectGroup = this.currentConfig['proxy-groups']?.find(group => group.name === "🔰 选择节点");
        if (!selectGroup)
            return [];
        return selectGroup.proxies
            .filter(name => name !== "DIRECT")
            .map(name => {
            const proxy = this.currentConfig?.proxies?.find(p => p.name === name);
            return {
                name,
                server: proxy?.server || "",
                type: proxy?.type || ""
            };
        });
    }
    async switchNode(nodeName) {
        try {
            if (!this.currentConfig) {
                throw new Error("配置未加载");
            }
            await axios.put(`http://${this.externalController}/proxies/🔰 选择节点`, { name: nodeName });
            return {
                success: true,
                message: `已切换到节点: ${nodeName}`
            };
        }
        catch (error) {
            return {
                success: false,
                message: `节点切换失败: ${error.message}`
            };
        }
    }
    async getAvailableUrls() {
        try {
            const urlListContent = await readFile(this.urlFilePath, "utf-8");
            return urlListContent
                .split("\n")
                .map(line => line.trim())
                .filter(line => line.length > 0);
        }
        catch (error) {
            console.error("读取URL列表失败:", error.message);
            return [];
        }
    }
}
export const clashManager = new ClashManager();
//# sourceMappingURL=clash_manager.js.map