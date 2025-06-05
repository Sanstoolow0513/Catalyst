import path from "path";
import axios from "axios";
import process from "process";
import yaml from "js-yaml";
import readline from "readline";
import { fileURLToPath } from "url";
import { readFile, writeFile, mkdir } from "fs/promises";
import { spawn } from "child_process";

// 代理设置相关常量
const PROXY_SERVER = "127.0.0.1:7890";
const PROXY_OVERRIDE =
  "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const urlFilePath = path.join(__dirname, "url.txt");
const clashConfigPath = path.join(__dirname, "config.yaml");
const clashExecutablePath = path.join(__dirname, "mihomo.exe");

/**
 * 下载Clash配置文件
 * @param {string} configUrl - 配置文件URL
 * @param {string} baseDir - 基础目录路径
 * @returns {Promise<string>} 下载的配置文件路径
 */
async function fetchConfig(configUrl, baseDir) {
  try {
    const encodedUrlHash = Buffer.from(configUrl)
      .toString("base64")
      .replace(/[\\/:*?"<>|]/g, "_");
    const configDirectory = path.join(baseDir, encodedUrlHash);
    const downloadedConfigPath = path.join(configDirectory, "config.yaml");
    
    await mkdir(configDirectory, { recursive: true });
    const response = await axios.get(configUrl, { responseType: "text" });
    await writeFile(downloadedConfigPath, response.data);
    
    console.log("配置文件已成功保存到", downloadedConfigPath);
    return downloadedConfigPath;
  } catch (error) {
    console.error("获取配置文件时发生错误:", error.message);
    throw error;
  }
}
async function clearSystemProxy() {
  return new Promise((resolve) => {
    const ps = spawn("powershell.exe", [
      "-Command",
      `
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

async function setSystemProxy() {
  return new Promise((resolve) => {
    const ps = spawn("powershell.exe", [
      "-Command",
      `
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

(async () => {
  try {
    // 读取URL列表文件
    const urlListContent = await readFile(urlFilePath, "utf-8");
    const availableUrls = urlListContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    if (availableUrls.length === 0) {
      console.error("没有找到有效的配置文件URL，请检查url.txt文件");
      return;
    }

    // 显示URL选项
    console.log("请选择配置文件编号：");
    availableUrls.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // 获取用户选择
    const selectedIndex = await new Promise((resolve) => {
      rl.question("输入编号: ", (answer) => {
        rl.close();
        const index = parseInt(answer) - 1;
        resolve(index);
      });
    });

    // 验证选择有效性
    if (
      isNaN(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex >= availableUrls.length
    ) {
      console.error("无效的选择");
      return;
    }

    const selectedConfigUrl = availableUrls[selectedIndex];
    console.log("正在获取配置文件:", selectedConfigUrl);
    
    // 下载配置文件
    const downloadedConfigPath = await fetchConfig(selectedConfigUrl, __dirname);
    
    // 读取并解析配置文件
    const configContent = await readFile(downloadedConfigPath, "utf-8");
    const clashConfig = yaml.load(configContent);
    const proxyPort = clashConfig.port;
    const externalController = clashConfig["external-controller"];
    
    console.log("代理端口:", proxyPort);
    console.log("外部控制器:", externalController);

    console.log("启动 Clash 服务...");
    const clashProcess = spawn(clashExecutablePath, ["-d", path.dirname(downloadedConfigPath)]);
    console.log("Clash进程ID:", clashProcess.pid);

    clashProcess.stdout.on("data", (data) => {
      console.log(`[clash]: ${data.toString().trim()}`);
    });

    clashProcess.stderr.on("data", (data) => {
      console.error(`[clash error]: ${data.toString().trim()}`);
    });

    // 等待Clash启动
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("设置系统代理...");
    const proxySetSuccess = await setSystemProxy();

    if (proxySetSuccess) {
      console.log("代理设置成功");
      
      // 添加节点选择功能
      try {
        const selectGroup = clashConfig["proxy-groups"].find(
          group => group.name === "🔰 选择节点"
        );
        
        if (selectGroup) {
          console.log("\n节点列表：");
          const proxiesInfo = [];
          
          // 测试并显示节点延迟
          for (const proxyName of selectGroup.proxies) {
            if (proxyName === "DIRECT") continue;
            
            try {
              const proxy = clashConfig.proxies.find(p => p.name === proxyName);
              if (!proxy) continue;
              
              // 测试延迟
              const startTime = Date.now();
              await axios.get("http://www.gstatic.com/generate_204", {
                proxy: {
                  host: "127.0.0.1",
                  port: proxyPort
                },
                timeout: 5000
              });
              const latency = Date.now() - startTime;
              
              proxiesInfo.push({
                name: proxyName,
                server: proxy.server,
                latency: latency
              });
              
              console.log(`${proxyName} - ${latency}ms`);
            } catch (error) {
              console.log(`${proxyName} - 超时`);
              proxiesInfo.push({
                name: proxyName,
                server: proxy.server,
                latency: -1
              });
            }
          }
          
          // 创建新的readline接口用于节点选择
          const rlNode = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          
          // 获取用户选择的节点
          const selectedNodeIndex = await new Promise((resolve) => {
            rlNode.question("\n请选择要使用的节点编号（输入0取消）: ", (answer) => {
              rlNode.close();
              resolve(parseInt(answer) - 1);
            });
          });
          
          if (selectedNodeIndex >= 0 && selectedNodeIndex < proxiesInfo.length) {
            const selectedProxy = proxiesInfo[selectedNodeIndex];
            console.log(`正在切换到节点: ${selectedProxy.name}`);
            
            // 通过API切换节点
            await axios.put(`http://${externalController}/proxies/🔰 选择节点`, {
              name: selectedProxy.name
            });
            
            console.log("节点切换成功");
          }
        }
      } catch (error) {
        console.error("节点选择出错:", error.message);
      }
    } else {
      console.log("代理设置失败，请手动设置:");
      console.log("打开Windows设置 -> 网络和Internet -> 代理");
      console.log(
        `地址: ${PROXY_SERVER.split(":")[0]}, 端口: ${PROXY_SERVER.split(":")[1]}`
      );
      console.log(`例外列表: ${PROXY_OVERRIDE}`);
    }

    // 注册进程退出处理
    process.on("exit", () => {
      if (!clashProcess.killed) {
        clashProcess.kill("SIGKILL");
      }
    });

    process.on("SIGINT", async () => {
      console.log("\n正在关闭服务...");
      if (!clashProcess.killed) {
        clashProcess.kill("SIGINT");
      }
      console.log("正在清除系统代理设置...");
      await clearSystemProxy();
      process.exit();
    });
  } catch (error) {
    console.error("程序运行出错:", error.message);
  }
})();
