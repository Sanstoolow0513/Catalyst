import { useReducer, useEffect } from 'react';
import * as yaml from 'js-yaml';
import { 
  ProxyState as IProxyState, 
  ProxyAction as IProxyAction,
  MihomoConfig 
} from '../types';

// 使用定义的类型
type ProxyState = IProxyState;

type ProxyAction = IProxyAction;

// 初始状态
const initialState: ProxyState = {
  isRunning: false,
  isLoading: true,
  isConfigLoading: false,
  isConfigSaving: false,
  statusMessage: '',
  isSuccess: false,
  configPath: '',
  configURL: '',
  config: '',
  autoStart: false,
  apiAvailable: false,
  hasConfig: false,
  isValidConfig: false,
  currentStep: 1,
  tunMode: false,
  unifiedDelay: false,
  tcpConcurrent: false,
  enableSniffer: false,
  port: 7890,
  socksPort: 7891,
  mixedPort: 7892,
  mode: 'rule',
  logLevel: 'info'
};

// Reducer
function proxyReducer(state: ProxyState, action: ProxyAction): ProxyState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CONFIG_LOADING':
      return { ...state, isConfigLoading: action.payload };
    case 'SET_CONFIG_SAVING':
      return { ...state, isConfigSaving: action.payload };
    case 'SET_STATUS_MESSAGE':
      return {
        ...state,
        statusMessage: action.payload.message,
        isSuccess: action.payload.success
      };
    case 'SET_RUNNING':
      return { ...state, isRunning: action.payload };
    case 'SET_CONFIG_PATH':
      return { ...state, configPath: action.payload };
    case 'SET_CONFIG_URL':
      return { ...state, configURL: action.payload };
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'SET_AUTO_START':
      return { ...state, autoStart: action.payload };
    case 'SET_API_AVAILABLE':
      return { ...state, apiAvailable: action.payload };
    case 'SET_HAS_CONFIG':
      return { ...state, hasConfig: action.payload };
    case 'SET_VALID_CONFIG':
      return { ...state, isValidConfig: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_TUN_MODE':
      return { ...state, tunMode: action.payload };
    case 'SET_UNIFIED_DELAY':
      return { ...state, unifiedDelay: action.payload };
    case 'SET_TCP_CONCURRENT':
      return { ...state, tcpConcurrent: action.payload };
    case 'SET_ENABLE_SNIFFER':
      return { ...state, enableSniffer: action.payload };
    case 'SET_PORT':
      return { ...state, port: action.payload };
    case 'SET_SOCKS_PORT':
      return { ...state, socksPort: action.payload };
    case 'SET_MIXED_PORT':
      return { ...state, mixedPort: action.payload };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_LOG_LEVEL':
      return { ...state, logLevel: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

// Hook
export function useProxyState() {
  const [state, dispatch] = useReducer(proxyReducer, initialState);

  // 检查配置有效性
  useEffect(() => {
    if (state.config.trim()) {
      try {
        // 使用 yaml 模块验证配置
        const configObj = yaml.load(state.config) as MihomoConfig;
        dispatch({ type: 'SET_VALID_CONFIG', payload: !!configObj && typeof configObj === 'object' });
      } catch {
        dispatch({ type: 'SET_VALID_CONFIG', payload: false });
      }
    } else {
      dispatch({ type: 'SET_VALID_CONFIG', payload: false });
    }
  }, [state.config]);

  // 检查 API 可用性
  useEffect(() => {
    const apiAvailable = window.electronAPI && 
                         window.electronAPI.mihomo && 
                         window.electronAPI.config;
    dispatch({ type: 'SET_API_AVAILABLE', payload: !!apiAvailable });
  }, []);

  // 根据运行状态更新步骤
  useEffect(() => {
    if (state.isRunning) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: 4 });
    }
  }, [state.isRunning]);

  return {
    state,
    dispatch,
    // 便捷的 action dispatchers
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setConfigLoading: (loading: boolean) => dispatch({ type: 'SET_CONFIG_LOADING', payload: loading }),
    setConfigSaving: (saving: boolean) => dispatch({ type: 'SET_CONFIG_SAVING', payload: saving }),
    setStatusMessage: (message: string, success: boolean) => 
      dispatch({ type: 'SET_STATUS_MESSAGE', payload: { message, success } }),
    setRunning: (running: boolean) => dispatch({ type: 'SET_RUNNING', payload: running }),
    setConfigPath: (path: string) => dispatch({ type: 'SET_CONFIG_PATH', payload: path }),
    setConfigURL: (url: string) => dispatch({ type: 'SET_CONFIG_URL', payload: url }),
    setConfig: (config: string) => dispatch({ type: 'SET_CONFIG', payload: config }),
    setAutoStart: (autoStart: boolean) => dispatch({ type: 'SET_AUTO_START', payload: autoStart }),
    setHasConfig: (hasConfig: boolean) => dispatch({ type: 'SET_HAS_CONFIG', payload: hasConfig }),
    setValidConfig: (valid: boolean) => dispatch({ type: 'SET_VALID_CONFIG', payload: valid }),
    setCurrentStep: (step: number) => dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    setTunMode: (enabled: boolean) => dispatch({ type: 'SET_TUN_MODE', payload: enabled }),
    setUnifiedDelay: (enabled: boolean) => dispatch({ type: 'SET_UNIFIED_DELAY', payload: enabled }),
    setTcpConcurrent: (enabled: boolean) => dispatch({ type: 'SET_TCP_CONCURRENT', payload: enabled }),
    setEnableSniffer: (enabled: boolean) => dispatch({ type: 'SET_ENABLE_SNIFFER', payload: enabled }),
    setPort: (port: number) => dispatch({ type: 'SET_PORT', payload: port }),
    setSocksPort: (port: number) => dispatch({ type: 'SET_SOCKS_PORT', payload: port }),
    setMixedPort: (port: number) => dispatch({ type: 'SET_MIXED_PORT', payload: port }),
    setMode: (mode: string) => dispatch({ type: 'SET_MODE', payload: mode }),
    setLogLevel: (level: string) => dispatch({ type: 'SET_LOG_LEVEL', payload: level }),
    resetState: () => dispatch({ type: 'RESET_STATE' })
  };
}

export type { ProxyState, ProxyAction };