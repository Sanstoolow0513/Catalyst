import { useReducer, useEffect, useCallback, useRef } from 'react';
import { proxyService, ProxyConnectionInfo, ProxyMetrics } from '../services/ProxyService';
import { 
  ProxyState as IProxyState, 
  ProxyAction as IProxyAction,
  ProxyGroup
} from '../types';

// 增强的状态接口
interface EnhancedProxyState extends IProxyState {
  // 连接信息
  connectionInfo: ProxyConnectionInfo | null;
  
  // 代理组
  proxyGroups: ProxyGroup[];
  
  // 延迟数据
  latencyData: Record<string, number>;
  
  // 指标数据
  metrics: ProxyMetrics | null;
  
  // 操作状态
  isTestingLatency: boolean;
  isFetchingGroups: boolean;
  
  // 错误状态
  lastError: string | null;
  errorCount: number;
  
  // 自动刷新
  autoRefresh: boolean;
  refreshInterval: number;
}

// 增强的 Action 类型
type EnhancedProxyAction = IProxyAction | 
  { type: 'SET_CONNECTION_INFO'; payload: ProxyConnectionInfo | null }
  | { type: 'SET_PROXY_GROUPS'; payload: ProxyGroup[] }
  | { type: 'SET_LATENCY_DATA'; payload: Record<string, number> }
  | { type: 'SET_METRICS'; payload: ProxyMetrics | null }
  | { type: 'SET_TESTING_LATENCY'; payload: boolean }
  | { type: 'SET_FETCHING_GROUPS'; payload: boolean }
  | { type: 'SET_LAST_ERROR'; payload: string | null }
  | { type: 'INCREMENT_ERROR_COUNT' }
  | { type: 'RESET_ERROR_COUNT' }
  | { type: 'SET_AUTO_REFRESH'; payload: boolean }
  | { type: 'SET_REFRESH_INTERVAL'; payload: number }
  | { type: 'UPDATE_PROXY_SELECTION'; payload: { groupName: string; proxyName: string } };

// 初始状态
const initialEnhancedState: EnhancedProxyState = {
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
  logLevel: 'info',
  
  // 增强的状态
  connectionInfo: null,
  proxyGroups: [],
  latencyData: {},
  metrics: null,
  isTestingLatency: false,
  isFetchingGroups: false,
  lastError: null,
  errorCount: 0,
  autoRefresh: true,
  refreshInterval: 10000, // 10秒
};

// 增强的 Reducer
function enhancedProxyReducer(state: EnhancedProxyState, action: EnhancedProxyAction): EnhancedProxyState {
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
        isSuccess: action.payload.success,
        lastError: action.payload.success ? null : action.payload.message
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
    
    // 增强的 Actions
    case 'SET_CONNECTION_INFO':
      return { ...state, connectionInfo: action.payload };
    case 'SET_PROXY_GROUPS':
      return { ...state, proxyGroups: action.payload, isFetchingGroups: false };
    case 'SET_LATENCY_DATA':
      return { ...state, latencyData: action.payload, isTestingLatency: false };
    case 'SET_METRICS':
      return { ...state, metrics: action.payload };
    case 'SET_TESTING_LATENCY':
      return { ...state, isTestingLatency: action.payload };
    case 'SET_FETCHING_GROUPS':
      return { ...state, isFetchingGroups: action.payload };
    case 'SET_LAST_ERROR':
      return { ...state, lastError: action.payload };
    case 'INCREMENT_ERROR_COUNT':
      return { ...state, errorCount: state.errorCount + 1 };
    case 'RESET_ERROR_COUNT':
      return { ...state, errorCount: 0 };
    case 'SET_AUTO_REFRESH':
      return { ...state, autoRefresh: action.payload };
    case 'SET_REFRESH_INTERVAL':
      return { ...state, refreshInterval: action.payload };
    case 'UPDATE_PROXY_SELECTION':
      return {
        ...state,
        proxyGroups: state.proxyGroups.map(group => 
          group.name === action.payload.groupName
            ? { ...group, now: action.payload.proxyName }
            : group
        )
      };
    
    case 'RESET_STATE':
      return initialEnhancedState;
    default:
      return state;
  }
}

// 增强的 Hook
export function useEnhancedProxyState() {
  const [state, dispatch] = useReducer(enhancedProxyReducer, initialEnhancedState);
  const refreshIntervalRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  // 安全的 dispatch 包装器
  const safeDispatch = useCallback((action: EnhancedProxyAction) => {
    if (mountedRef.current) {
      dispatch(action);
    }
  }, []);

  // 错误处理
  const handleError = useCallback((error: string) => {
    console.error('ProxyState Error:', error);
    safeDispatch({ type: 'SET_LAST_ERROR', payload: error });
    safeDispatch({ type: 'INCREMENT_ERROR_COUNT' });
    safeDispatch({ type: 'SET_STATUS_MESSAGE', payload: { message: error, success: false } });
  }, [safeDispatch]);

  // 成功处理
  const handleSuccess = useCallback((message: string) => {
    safeDispatch({ type: 'RESET_ERROR_COUNT' });
    safeDispatch({ type: 'SET_LAST_ERROR', payload: null });
    safeDispatch({ type: 'SET_STATUS_MESSAGE', payload: { message, success: true } });
  }, [safeDispatch]);

  // 获取状态
  const refreshStatus = useCallback(async () => {
    if (!state.apiAvailable) return;
    
    try {
      const result = await proxyService.getStatus();
      if (result.success && result.data) {
        safeDispatch({ type: 'SET_RUNNING', payload: result.data.isRunning });
      } else {
        handleError(result.error || '获取状态失败');
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : '获取状态失败');
    }
  }, [state.apiAvailable, safeDispatch, handleError]);

  // 获取连接信息
  const refreshConnectionInfo = useCallback(async () => {
    if (!state.apiAvailable) return;
    
    try {
      const result = await proxyService.getConnectionInfo();
      if (result.success) {
        safeDispatch({ type: 'SET_CONNECTION_INFO', payload: result.data });
      }
    } catch (error) {
      console.warn('获取连接信息失败:', error);
    }
  }, [state.apiAvailable, safeDispatch]);

  // 获取代理组
  const refreshProxyGroups = useCallback(async () => {
    if (!state.apiAvailable || !state.isRunning) return;
    
    safeDispatch({ type: 'SET_FETCHING_GROUPS', payload: true });
    
    try {
      const result = await proxyService.getProxyGroups();
      if (result.success && result.data) {
        safeDispatch({ type: 'SET_PROXY_GROUPS', payload: result.data });
      } else {
        safeDispatch({ type: 'SET_FETCHING_GROUPS', payload: false });
        handleError(result.error || '获取代理组失败');
      }
    } catch (error) {
      safeDispatch({ type: 'SET_FETCHING_GROUPS', payload: false });
      handleError(error instanceof Error ? error.message : '获取代理组失败');
    }
  }, [state.apiAvailable, state.isRunning, safeDispatch, handleError]);

  // 测试延迟
  const testAllDelays = useCallback(async () => {
    if (!state.apiAvailable || !state.isRunning || state.proxyGroups.length === 0) {
      return;
    }
    
    safeDispatch({ type: 'SET_TESTING_LATENCY', payload: true });
    
    try {
      const result = await proxyService.testAllProxyDelays();
      if (result.success && result.data) {
        safeDispatch({ type: 'SET_LATENCY_DATA', payload: result.data });
        handleSuccess('延迟测试完成');
      } else {
        safeDispatch({ type: 'SET_TESTING_LATENCY', payload: false });
        handleError(result.error || '延迟测试失败');
      }
    } catch (error) {
      safeDispatch({ type: 'SET_TESTING_LATENCY', payload: false });
      handleError(error instanceof Error ? error.message : '延迟测试失败');
    }
  }, [state.apiAvailable, state.isRunning, state.proxyGroups.length, safeDispatch, handleError, handleSuccess]);

  // 获取指标
  const refreshMetrics = useCallback(async () => {
    if (!state.apiAvailable || !state.isRunning) return;
    
    try {
      const result = await proxyService.getProxyMetrics();
      if (result.success) {
        safeDispatch({ type: 'SET_METRICS', payload: result.data });
      }
    } catch (error) {
      console.warn('获取指标失败:', error);
    }
  }, [state.apiAvailable, state.isRunning, safeDispatch]);

  // 启动代理
  const startProxy = useCallback(async () => {
    if (!state.hasConfig || !state.isValidConfig) {
      handleError('请先获取并验证配置');
      return;
    }
    
    safeDispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await proxyService.start();
      if (result.success) {
        handleSuccess('代理启动成功');
        safeDispatch({ type: 'SET_CURRENT_STEP', payload: 4 });
        await refreshStatus();
        await refreshProxyGroups();
      } else {
        handleError(result.error || '启动失败');
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : '启动失败');
    } finally {
      safeDispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.hasConfig, state.isValidConfig, safeDispatch, handleError, handleSuccess, refreshStatus, refreshProxyGroups]);

  // 停止代理
  const stopProxy = useCallback(async () => {
    safeDispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await proxyService.stop();
      if (result.success) {
        handleSuccess('代理停止成功');
        safeDispatch({ type: 'SET_CURRENT_STEP', payload: 3 });
        safeDispatch({ type: 'SET_PROXY_GROUPS', payload: [] });
        safeDispatch({ type: 'SET_LATENCY_DATA', payload: {} });
        safeDispatch({ type: 'SET_METRICS', payload: null });
        await refreshStatus();
      } else {
        handleError(result.error || '停止失败');
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : '停止失败');
    } finally {
      safeDispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [safeDispatch, handleError, handleSuccess, refreshStatus]);

  // 选择代理
  const selectProxy = useCallback(async (groupName: string, proxyName: string) => {
    try {
      const result = await proxyService.selectProxy(groupName, proxyName);
      if (result.success) {
        safeDispatch({ type: 'UPDATE_PROXY_SELECTION', payload: { groupName, proxyName } });
        handleSuccess(`已选择代理: ${proxyName}`);
      } else {
        handleError(result.error || '选择代理失败');
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : '选择代理失败');
    }
  }, [safeDispatch, handleError, handleSuccess]);

  // 全量刷新
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshStatus(),
      refreshConnectionInfo(),
      refreshProxyGroups(),
      refreshMetrics()
    ]);
  }, [refreshStatus, refreshConnectionInfo, refreshProxyGroups, refreshMetrics]);

  // 自动刷新逻辑
  useEffect(() => {
    if (state.autoRefresh && state.isRunning && state.apiAvailable) {
      refreshIntervalRef.current = setInterval(() => {
        refreshAll();
      }, state.refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [state.autoRefresh, state.isRunning, state.apiAvailable, state.refreshInterval, refreshAll]);

  // 初始化
  useEffect(() => {
    const initialize = async () => {
      // 检查 API 可用性
      const apiAvailable = !!(window.electronAPI?.mihomo && window.electronAPI?.config);
      safeDispatch({ type: 'SET_API_AVAILABLE', payload: apiAvailable });
      
      if (apiAvailable) {
        await refreshAll();
        
        // 加载保存的配置URL
        try {
          const urlResult = await window.electronAPI.config.getVpnUrl();
          if (urlResult.success && urlResult.data) {
            safeDispatch({ type: 'SET_CONFIG_URL', payload: urlResult.data });
          }
        } catch (error) {
          console.warn('加载配置URL失败:', error);
        }

        // 加载自动启动设置
        try {
          const autoStartResult = await window.electronAPI.config.getProxyAutoStart();
          if (autoStartResult.success && autoStartResult.data !== undefined) {
            safeDispatch({ type: 'SET_AUTO_START', payload: autoStartResult.data });
          }
        } catch (error) {
          console.warn('加载自动启动设置失败:', error);
        }
      }
      
      safeDispatch({ type: 'SET_LOADING', payload: false });
    };

    initialize();
  }, [safeDispatch, refreshAll]);

  // 清理
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // 返回状态和操作
  return {
    // 状态
    state,
    
    // 计算属性
    isOperating: state.isLoading || state.isConfigLoading || state.isConfigSaving || state.isTestingLatency,
    canStart: state.apiAvailable && state.hasConfig && state.isValidConfig && !state.isLoading,
    canStop: state.apiAvailable && state.isRunning && !state.isLoading,
    
    // 基础操作
    startProxy,
    stopProxy,
    selectProxy,
    testAllDelays,
    
    // 刷新操作
    refreshStatus,
    refreshConnectionInfo,
    refreshProxyGroups,
    refreshMetrics,
    refreshAll,
    
    // 状态设置器 (兼容旧接口)
    setLoading: (loading: boolean) => safeDispatch({ type: 'SET_LOADING', payload: loading }),
    setConfigLoading: (loading: boolean) => safeDispatch({ type: 'SET_CONFIG_LOADING', payload: loading }),
    setConfigSaving: (saving: boolean) => safeDispatch({ type: 'SET_CONFIG_SAVING', payload: saving }),
    setStatusMessage: (message: string, success: boolean) => 
      safeDispatch({ type: 'SET_STATUS_MESSAGE', payload: { message, success } }),
    setRunning: (running: boolean) => safeDispatch({ type: 'SET_RUNNING', payload: running }),
    setConfigPath: (path: string) => safeDispatch({ type: 'SET_CONFIG_PATH', payload: path }),
    setConfigURL: (url: string) => safeDispatch({ type: 'SET_CONFIG_URL', payload: url }),
    setConfig: (config: string) => safeDispatch({ type: 'SET_CONFIG', payload: config }),
    setAutoStart: (autoStart: boolean) => safeDispatch({ type: 'SET_AUTO_START', payload: autoStart }),
    setHasConfig: (hasConfig: boolean) => safeDispatch({ type: 'SET_HAS_CONFIG', payload: hasConfig }),
    setValidConfig: (valid: boolean) => safeDispatch({ type: 'SET_VALID_CONFIG', payload: valid }),
    setCurrentStep: (step: number) => safeDispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    setTunMode: (enabled: boolean) => safeDispatch({ type: 'SET_TUN_MODE', payload: enabled }),
    setUnifiedDelay: (enabled: boolean) => safeDispatch({ type: 'SET_UNIFIED_DELAY', payload: enabled }),
    setTcpConcurrent: (enabled: boolean) => safeDispatch({ type: 'SET_TCP_CONCURRENT', payload: enabled }),
    setEnableSniffer: (enabled: boolean) => safeDispatch({ type: 'SET_ENABLE_SNIFFER', payload: enabled }),
    setPort: (port: number) => safeDispatch({ type: 'SET_PORT', payload: port }),
    setSocksPort: (port: number) => safeDispatch({ type: 'SET_SOCKS_PORT', payload: port }),
    setMixedPort: (port: number) => safeDispatch({ type: 'SET_MIXED_PORT', payload: port }),
    setMode: (mode: string) => safeDispatch({ type: 'SET_MODE', payload: mode }),
    setLogLevel: (level: string) => safeDispatch({ type: 'SET_LOG_LEVEL', payload: level }),
    
    // 增强操作
    setAutoRefresh: (enabled: boolean) => safeDispatch({ type: 'SET_AUTO_REFRESH', payload: enabled }),
    setRefreshInterval: (interval: number) => safeDispatch({ type: 'SET_REFRESH_INTERVAL', payload: interval }),
    
    resetState: () => safeDispatch({ type: 'RESET_STATE' })
  };
}

export type { EnhancedProxyState, EnhancedProxyAction };