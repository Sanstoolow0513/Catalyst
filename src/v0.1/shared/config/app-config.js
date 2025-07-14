// 应用程序共享配置参数

const PROXY_SERVER = '127.0.0.1:7890';
const PROXY_OVERRIDE =
  'localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*';

// 应用程序版本和名称
const APP_VERSION = '1.0.0';
const APP_NAME = '多功能系统工具';

// 资源路径配置
const RESOURCE_PATHS = {
  CLASH_CONFIG_DIR: 'resources/clash/configs',
  CLASH_CORE_DIR: 'resources/clash/core',
  INSTALLERS_DIR: 'resources/installers',
};

// 默认窗口配置
const DEFAULT_WINDOW_CONFIG = {
  width: 850,
  height: 750,
  minWidth: 800,
  minHeight: 600,
  frame: false,
  titleBarStyle: 'hidden',
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    webviewTag: true,
    devTools: true,
  },
};

// 导出配置
module.exports = {
  PROXY_SERVER,
  PROXY_OVERRIDE,
  APP_VERSION,
  APP_NAME,
  RESOURCE_PATHS,
  DEFAULT_WINDOW_CONFIG,
}; 