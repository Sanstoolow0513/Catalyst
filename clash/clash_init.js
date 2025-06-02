import path from "path";
import axios from "axios";
import process, { config } from "process";
import yaml from "js-yaml";
import readline from "readline";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile, mkdir } from "fs/promises";
import { spawn } from "child_process";

// 代理设置相关常量
const PROXY_SERVER = "127.0.0.1:7890";
const PROXY_OVERRIDE =
  "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const urlPath = path.join(__dirname, "url.txt");
const configPath = path.join(__dirname, "config.yaml", "config.yaml");
const mihomoPath = path.join(__dirname, "mihomo.exe");

async function fetchConfig(url, __dirname) {
  try {
    const encodedUrl = Buffer.from(url)
      .toString("base64")
      .replace(/[\\/:*?"<>|]/g, "_");
    const response = await axios.get(url, { responseType: "text" });
    const tempDir = path.join(__dirname, encodedUrl, "config.yaml");
    const tempDirDir = path.join(__dirname, encodedUrl);
    await mkdir(tempDirDir, { recursive: true });
    await writeFile(tempDir, response.data);
    console.log("配置文件已成功保存到", tempDir);
  } catch (error) {
    console.error("获取配置文件时发生错误:", error.message);
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

async () => {
  // await fetchConfig(data.trim(), configPath);
  /**
   * todos : 主要是多配置的实现，现在已经完成未调试
   * ! 数据传递他问题
   */
  const data = await readFile(urlPath, "utf-8");
  const urlArray = data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  for (const url of urlArray) {
    console.log("正在获取配置文件:", url);
    fetchConfig(url, __dirname).catch((err) =>
      console.error(`配置获取失败 ${url}:`, err.message)
    );
  }
  const temp = yaml.load(await readFile(configPath, "utf-8"));
  const proxyport = temp.port;
  const externalcontroller = temp["external-controller"];
  console.log("proxyport:", proxyport);

  console.log("启动 Clash 服务...");

  const clashProcess = spawn(mihomoPath, ["-d", path.dirname(configPath)]);
  console.log("clash.pid:", clashProcess.pid);

  clashProcess.stdout.on("data", (data) => {
    console.log(`[clash]: ${data.toString().trim()}`);
  });

  clashProcess.stderr.on("data", (data) => {
    console.error(`[clash error]: ${data.toString().trim()}`);
  });

  // 等待Clash启动完成
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("设置系统代理...");
  const proxySet = await setSystemProxy();

  if (proxySet) {
    console.log("代理设置成功");
  } else {
    console.log("代理设置失败，请手动设置:");
    console.log("打开Windows设置 -> 网络和Internet -> 代理");
    console.log(
      `地址: ${PROXY_SERVER.split(":")[0]}, 端口: ${PROXY_SERVER.split(":")[1]}`
    );
    console.log(`例外列表: ${PROXY_OVERRIDE}`);
  }

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
};
// ();
