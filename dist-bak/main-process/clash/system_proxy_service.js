import { spawn } from 'child_process';
export class SystemProxyService {
    proxyOverride = "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*";
    async setSystemProxy(proxyServer) {
        return this.executePowerShellCommand(`
      Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyEnable -value 1
      Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyServer -value "${proxyServer}"
      Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyOverride -value "${this.proxyOverride}"
      $signature = @"
        [DllImport("wininet.dll", SetLastError = true, CharSet=CharSet.Auto)]
        public static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int lpdwBufferLength);
      "@
      $type = Add-Type -MemberDefinition $signature -Name wininet -Namespace pinvoke -PassThru
      $null = $type::InternetSetOption([IntPtr]::Zero, 39, [IntPtr]::Zero, 0)
      $null = $type::InternetSetOption([IntPtr]::Zero, 37, [IntPtr]::Zero, 0)
    `);
    }
    async clearSystemProxy() {
        return this.executePowerShellCommand(`
      Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -name ProxyEnable -value 0
      $signature = @"
        [DllImport("wininet.dll", SetLastError = true, CharSet=CharSet.Auto)]
        public static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int lpdwBufferLength);
      "@
      $type = Add-Type -MemberDefinition $signature -Name wininet -Namespace pinvoke -PassThru
      $null = $type::InternetSetOption([IntPtr]::Zero, 39, [IntPtr]::Zero, 0)
      $null = $type::InternetSetOption([IntPtr]::Zero, 37, [IntPtr]::Zero, 0)
    `);
    }
    executePowerShellCommand(script) {
        return new Promise((resolve) => {
            const ps = spawn("powershell.exe", [
                "-Command",
                script
            ]);
            ps.on("close", (code) => {
                if (code === 0) {
                    console.log("代理设置成功");
                    resolve(true);
                }
                else {
                    console.error(`代理设置失败，退出码: ${code}`);
                    resolve(false);
                }
            });
            ps.on("error", (error) => {
                console.error("执行PowerShell命令出错:", error);
                resolve(false);
            });
        });
    }
}
//# sourceMappingURL=system_proxy_service.js.map