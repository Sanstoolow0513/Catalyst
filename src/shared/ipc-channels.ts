export const IPCChannels = {
  // Clash服务
  CLASH_START: 'clash:start',
  CLASH_STOP: 'clash:stop',
  CLASH_STATUS: 'clash:status',
  CLASH_RESTART: 'clash:restart',
  
  // 代理管理
  PROXY_LIST: 'proxy:list',
  PROXY_SWITCH: 'proxy:switch',
  PROXY_TEST: 'proxy:test',
  PROXY_GROUPS: 'proxy:groups',
  
  // 配置管理
  CONFIG_LOAD: 'config:load',
  CONFIG_SAVE: 'config:save',
  CONFIG_UPDATE: 'config:update',
  
  // 系统信息
  SYSTEM_INFO: 'system:info',
  
  // 窗口控制
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
  WINDOW_SHOW: 'window:show',
  
  // 文件操作
  FILE_SELECT: 'file:select',
  FILE_SAVE: 'file:save',
  
  // 通知
  NOTIFICATION_SHOW: 'notification:show',
  NOTIFICATION_CLOSE: 'notification:close',
} as const

export type IPCChannelsType = typeof IPCChannels