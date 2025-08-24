// API 响应类型定义
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Mihomo 状态
export interface MihomoStatus {
  isRunning: boolean;
  pid?: number;
  version?: string;
}

// Mihomo 配置
export interface MihomoConfig {
  port: number;
  'socks-port': number;
  'mixed-port': number;
  mode: 'rule' | 'global' | 'direct';
  'log-level': 'silent' | 'error' | 'warning' | 'info' | 'debug';
  'unified-delay': boolean;
  'tcp-concurrent': boolean;
  tun?: {
    enable: boolean;
    stack: string;
    'dns-hijack': string[];
    'auto-route': boolean;
    'auto-detect-interface': boolean;
  };
  sniffer?: {
    enable: boolean;
    'parse-pure-ip': boolean;
  };
  [key: string]: unknown;
}

// 代理信息
export interface ProxyInfo {
  name: string;
  type: string;
  now: string;
  all: string[];
  proxies: string[];
  providers: string[];
  history: Array<{
    time: string;
    delay: number;
  }>;
}

// 代理组信息
export interface ProxyGroup {
  name: string;
  type: string;
  now: string;
  proxies: string[];
  providers: string[];
  latencyHistory: Array<{
    time: string;
    delay: number;
  }>;
}

// 延迟测试结果
export interface DelayTestResult {
  [key: string]: number;
}

// 配置状态
export interface ConfigState {
  url: string;
  isValid: boolean;
  hasConfig: boolean;
  lastUpdated: string;
}

// 应用状态
export interface AppState {
  isProxyRunning: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  config: ConfigState;
  proxy: {
    groups: ProxyGroup[];
    latency: DelayTestResult;
  };
}

// 代理状态
export interface ProxyState {
  isRunning: boolean;
  isLoading: boolean;
  isConfigLoading: boolean;
  isConfigSaving: boolean;
  statusMessage: string;
  isSuccess: boolean;
  configPath: string;
  configURL: string;
  config: string;
  autoStart: boolean;
  apiAvailable: boolean;
  hasConfig: boolean;
  isValidConfig: boolean;
  currentStep: number;
  tunMode: boolean;
  unifiedDelay: boolean;
  tcpConcurrent: boolean;
  enableSniffer: boolean;
  port: number;
  socksPort: number;
  mixedPort: number;
  mode: string;
  logLevel: string;
}

// 事件类型
export type AppEvent = 
  | { type: 'SET_PROXY_RUNNING'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { hasError: boolean; message: string } }
  | { type: 'SET_CONFIG'; payload: ConfigState }
  | { type: 'SET_PROXY_GROUPS'; payload: ProxyGroup[] }
  | { type: 'SET_LATENCY_DATA'; payload: DelayTestResult }
  | { type: 'RESET_STATE' };

// 代理状态 Action 类型
export type ProxyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONFIG_LOADING'; payload: boolean }
  | { type: 'SET_CONFIG_SAVING'; payload: boolean }
  | { type: 'SET_STATUS_MESSAGE'; payload: { message: string; success: boolean } }
  | { type: 'SET_RUNNING'; payload: boolean }
  | { type: 'SET_CONFIG_PATH'; payload: string }
  | { type: 'SET_CONFIG_URL'; payload: string }
  | { type: 'SET_CONFIG'; payload: string }
  | { type: 'SET_AUTO_START'; payload: boolean }
  | { type: 'SET_API_AVAILABLE'; payload: boolean }
  | { type: 'SET_HAS_CONFIG'; payload: boolean }
  | { type: 'SET_VALID_CONFIG'; payload: boolean }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_TUN_MODE'; payload: boolean }
  | { type: 'SET_UNIFIED_DELAY'; payload: boolean }
  | { type: 'SET_TCP_CONCURRENT'; payload: boolean }
  | { type: 'SET_ENABLE_SNIFFER'; payload: boolean }
  | { type: 'SET_PORT'; payload: number }
  | { type: 'SET_SOCKS_PORT'; payload: number }
  | { type: 'SET_MIXED_PORT'; payload: number }
  | { type: 'SET_MODE'; payload: string }
  | { type: 'SET_LOG_LEVEL'; payload: string }
  | { type: 'RESET_STATE' };

// 组件 Props 类型
export interface ProxyManagerProps {
  className?: string;
  onStateChange?: (state: AppState) => void;
}

export interface ProxyStatusProps {
  isRunning: boolean;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
  onTestLatency: () => void;
  hasConfig: boolean;
  isValidConfig: boolean;
}

export interface ConfigManagerProps {
  configURL: string;
  config: string;
  configPath: string;
  isValidConfig: boolean;
  isConfigLoading: boolean;
  isConfigSaving: boolean;
  onConfigURLChange: (url: string) => void;
  onConfigChange: (config: string) => void;
  onFetchConfig: () => void;
  onSaveConfig: () => void;
  onLoadConfig: () => void;
  onOpenConfigDir: () => void;
}

export interface AdvancedSettingsProps {
  autoStart: boolean;
  tunMode: boolean;
  unifiedDelay: boolean;
  tcpConcurrent: boolean;
  enableSniffer: boolean;
  port: number;
  socksPort: number;
  mixedPort: number;
  mode: string;
  logLevel: string;
  onAutoStartChange: (checked: boolean) => void;
  onTunModeChange: (checked: boolean) => void;
  onUnifiedDelayChange: (checked: boolean) => void;
  onTcpConcurrentChange: (checked: boolean) => void;
  onEnableSnifferChange: (checked: boolean) => void;
  onPortChange: (port: number) => void;
  onSocksPortChange: (port: number) => void;
  onMixedPortChange: (port: number) => void;
  onModeChange: (mode: string) => void;
  onLogLevelChange: (level: string) => void;
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}

// 工具函数类型
export type ErrorHandler = (error: AppError) => void;
export type SuccessHandler<T = unknown> = (result: T) => void;
export type LoadingHandler = (isLoading: boolean) => void;