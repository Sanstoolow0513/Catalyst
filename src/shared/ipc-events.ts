export const IPC_EVENTS = {
  MIHOMO_START: 'mihomo:start',
  MIHOMO_STOP: 'mihomo:stop',
  MIHOMO_STATUS: 'mihomo:status',
  MIHOMO_STATUS_UPDATE: 'mihomo:status-update',
  MIHOMO_LOAD_CONFIG: 'mihomo:load-config',
  MIHOMO_SAVE_CONFIG: 'mihomo:save-config',
  MIHOMO_GET_CONFIG_PATH: 'mihomo:get-config-path',
  MIHOMO_OPEN_CONFIG_DIR: 'mihomo:open-config-dir',
  
  // Mihomo 代理组相关事件
  MIHOMO_GET_PROXIES: 'mihomo:get-proxies',
  MIHOMO_SELECT_PROXY: 'mihomo:select-proxy',
  MIHOMO_FETCH_CONFIG_FROM_URL: 'mihomo:fetch-config-from-url',
  
  // 开发环境相关事件
  DEV_ENV_INSTALL_VSCODE: 'dev-env:install-vscode',
  DEV_ENV_INSTALL_NODEJS: 'dev-env:install-nodejs',
  DEV_ENV_INSTALL_PYTHON: 'dev-env:install-python',
  
  // LLM 相关事件
  LLM_GENERATE_COMPLETION: 'llm:generate-completion',
  LLM_SET_API_KEY: 'llm:set-api-key',
  LLM_GET_API_KEY: 'llm:get-api-key',
  LLM_GET_ALL_API_KEYS: 'llm:get-all-api-keys',
  LLM_DELETE_API_KEY: 'llm:delete-api-key',
  LLM_SET_PROVIDER_CONFIG: 'llm:set-provider-config',
  LLM_GET_PROVIDER_CONFIG: 'llm:get-provider-config',
  LLM_GET_PROVIDERS: 'llm:get-providers',
  LLM_GET_MODELS: 'llm:get-models',
  
  // 配置管理相关事件
  CONFIG_GET_ALL: 'config:get-all',
  CONFIG_SET_VPN_URL: 'config:set-vpn-url',
  CONFIG_GET_VPN_URL: 'config:get-vpn-url',
  CONFIG_SET_PROXY_AUTO_START: 'config:set-proxy-auto-start',
  CONFIG_GET_PROXY_AUTO_START: 'config:get-proxy-auto-start',
  CONFIG_EXPORT: 'config:export',
  CONFIG_IMPORT: 'config:import',
  CONFIG_RESET: 'config:reset',
  CONFIG_SET_USER_NAME: 'config:set-user-name',
  CONFIG_GET_USER_NAME: 'config:get-user-name',
  CONFIG_SET_USER_EMAIL: 'config:set-user-email',
  CONFIG_GET_USER_EMAIL: 'config:get-user-email',
  CONFIG_SET_STARTUP: 'config:set-startup',
  CONFIG_GET_STARTUP: 'config:get-startup',
  CONFIG_SET_MINIMIZE_TO_TRAY: 'config:set-minimize-to-tray',
  CONFIG_GET_MINIMIZE_TO_TRAY: 'config:get-minimize-to-tray',
  CONFIG_SET_NOTIFICATIONS: 'config:set-notifications',
  CONFIG_GET_NOTIFICATIONS: 'config:get-notifications',
  CONFIG_GET_USAGE_STATS: 'config:get-usage-stats',
  CONFIG_CREATE_BACKUP: 'config:create-backup',
  CONFIG_RESTORE_FROM_BACKUP: 'config:restore-from-backup',
  CONFIG_GET_BACKUP_FILES: 'config:get-backup-files',
  CONFIG_VALIDATE_CONFIG: 'config:validate-config',
  CONFIG_MIGRATE_CONFIG: 'config:migrate-config',
  
  // 窗口控制事件
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
};