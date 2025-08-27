import { j as jsxRuntimeExports } from "./mui-vendor-CTE_O7gT.js";
import { r as reactExports, d as dt } from "./styled-components-eg0Rzwc1.js";
import { u as useTheme } from "./index-C-fhFnDy.js";
import { B as Button, P as PageContainer } from "./PageContentLayout-2hb2Ff8p.js";
import { A as Activity, W as Wifi, l as Clock, G as Globe, m as Users, Z as Zap, n as Gauge, o as TrendingUp, p as CircleX, a as Settings, D as Download, S as Shield, P as Play, i as CircleCheckBig, R as RefreshCw, q as Save, F as FolderOpen, L as Layers, d as Search, r as Funnel, s as ChevronDown, t as ArrowUpDown, c as ChevronRight } from "./icons-CcncyDR1.js";
import { m as motion, A as AnimatePresence } from "./animation-DwHr2ej_.js";
import { S as StatusIndicator } from "./StatusIndicator-7Lw0xWRZ.js";
import { d as dump, l as load } from "./utils-CO-nVJB8.js";
import "./react-vendor-BS-dYsv0.js";
import "./routing-oDjbPx8E.js";
class ProxyService {
  static instance;
  statusCheckInterval = null;
  metricsCache = null;
  lastStatusCheck = 0;
  constructor() {
  }
  static getInstance() {
    if (!ProxyService.instance) {
      ProxyService.instance = new ProxyService();
    }
    return ProxyService.instance;
  }
  /**
   * 获取代理服务状态
   */
  async getStatus() {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: "Mihomo API 不可用" };
      }
      const result = await window.electronAPI.mihomo.status();
      this.lastStatusCheck = Date.now();
      return {
        success: true,
        data: {
          isRunning: result.isRunning,
          pid: result.pid,
          version: result.version
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "获取状态失败"
      };
    }
  }
  /**
   * 启动代理服务
   */
  async start() {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: "Mihomo API 不可用" };
      }
      const result = await window.electronAPI.mihomo.start();
      if (result.success) {
        this.startStatusMonitoring();
        return { success: true };
      } else {
        return { success: false, error: result.error || "启动失败" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "启动失败"
      };
    }
  }
  /**
   * 停止代理服务
   */
  async stop() {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: "Mihomo API 不可用" };
      }
      const result = await window.electronAPI.mihomo.stop();
      if (result.success) {
        this.stopStatusMonitoring();
        return { success: true };
      } else {
        return { success: false, error: result.error || "停止失败" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "停止失败"
      };
    }
  }
  /**
   * 获取连接信息
   */
  async getConnectionInfo() {
    try {
      const configResult = await this.getConfig();
      if (!configResult.success || !configResult.data) {
        return { success: false, error: "无法获取配置信息" };
      }
      const statusResult = await this.getStatus();
      const config = configResult.data;
      return {
        success: true,
        data: {
          httpPort: config.port,
          socksPort: config["socks-port"],
          mixedPort: config["mixed-port"],
          isRunning: statusResult.data?.isRunning || false,
          uptime: statusResult.data?.isRunning ? Date.now() - this.lastStatusCheck : void 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "获取连接信息失败"
      };
    }
  }
  /**
   * 获取配置
   */
  async getConfig() {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: "Mihomo API 不可用" };
      }
      const result = await window.electronAPI.mihomo.loadConfig();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "获取配置失败"
      };
    }
  }
  /**
   * 保存配置
   */
  async saveConfig(config) {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: "Mihomo API 不可用" };
      }
      const validation = this.validateConfig(config);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }
      const result = await window.electronAPI.mihomo.saveConfig(config);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "保存配置失败"
      };
    }
  }
  /**
   * 从URL获取配置
   */
  async fetchConfigFromURL(url) {
    try {
      if (!url.trim()) {
        return { success: false, error: "请提供有效的配置URL" };
      }
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: "Mihomo API 不可用" };
      }
      const result = await window.electronAPI.mihomo.fetchConfigFromURL(url);
      if (result.success && result.data) {
        await this.saveConfigURL(url);
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "获取配置失败"
      };
    }
  }
  /**
   * 获取代理组列表
   */
  async getProxyGroups() {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: "Mihomo API 不可用" };
      }
      const result = await window.electronAPI.mihomo.getProxies();
      if (result.success && result.data) {
        const groups = [];
        Object.entries(result.data.proxies).forEach(([name, proxy]) => {
          if (proxy.all && Array.isArray(proxy.all) || proxy.proxies && Array.isArray(proxy.proxies)) {
            groups.push({
              name,
              type: proxy.type,
              now: proxy.now,
              proxies: proxy.all || proxy.proxies,
              providers: proxy.providers || [],
              latencyHistory: proxy.history || []
            });
          }
        });
        return { success: true, data: groups };
      }
      return { success: false, error: "获取代理组失败" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "获取代理组失败"
      };
    }
  }
  /**
   * 选择代理
   */
  async selectProxy(groupName, proxyName) {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: "Mihomo API 不可用" };
      }
      const result = await window.electronAPI.mihomo.selectProxy(groupName, proxyName);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "选择代理失败"
      };
    }
  }
  /**
   * 测试单个代理延迟
   */
  async testProxyDelay(proxyName) {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: "Mihomo API 不可用" };
      }
      const result = await window.electronAPI.mihomo.testProxyDelay(proxyName);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "测试延迟失败"
      };
    }
  }
  /**
   * 批量测试代理延迟
   */
  async testAllProxyDelays() {
    try {
      const groupsResult = await this.getProxyGroups();
      if (!groupsResult.success || !groupsResult.data) {
        return { success: false, error: "无法获取代理组信息" };
      }
      const delayResults = {};
      const allProxies = /* @__PURE__ */ new Set();
      groupsResult.data.forEach((group) => {
        group.proxies.forEach((proxy) => allProxies.add(proxy));
      });
      const delayPromises = Array.from(allProxies).map(async (proxyName) => {
        try {
          const delayResult = await this.testProxyDelay(proxyName);
          return {
            name: proxyName,
            delay: delayResult.success ? delayResult.data || -1 : -1
          };
        } catch {
          return { name: proxyName, delay: -1 };
        }
      });
      const results = await Promise.all(delayPromises);
      results.forEach(({ name, delay }) => {
        delayResults[name] = delay;
      });
      return { success: true, data: delayResults };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "批量测试延迟失败"
      };
    }
  }
  /**
   * 获取代理指标
   */
  async getProxyMetrics() {
    try {
      const groupsResult = await this.getProxyGroups();
      if (!groupsResult.success || !groupsResult.data) {
        return { success: false, error: "无法获取代理组信息" };
      }
      const delaysResult = await this.testAllProxyDelays();
      const delays = delaysResult.success ? delaysResult.data || {} : {};
      let totalProxies = 0;
      let activeProxies = 0;
      let totalDelay = 0;
      let healthyProxies = 0;
      groupsResult.data.forEach((group) => {
        group.proxies.forEach((proxyName) => {
          totalProxies++;
          if (group.now === proxyName) {
            activeProxies++;
          }
          const delay = delays[proxyName];
          if (delay && delay > 0) {
            healthyProxies++;
            totalDelay += delay;
          }
        });
      });
      const metrics = {
        totalProxies,
        activeProxies,
        avgDelay: healthyProxies > 0 ? Math.round(totalDelay / healthyProxies) : 0,
        healthyProxies
      };
      this.metricsCache = metrics;
      return { success: true, data: metrics };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "获取代理指标失败"
      };
    }
  }
  /**
   * 验证配置
   */
  validateConfig(config) {
    if (!config || typeof config !== "object") {
      return { isValid: false, error: "配置不能为空" };
    }
    const requiredFields = ["port", "mode"];
    for (const field of requiredFields) {
      if (config[field] === void 0) {
        return { isValid: false, error: `缺少必需字段: ${field}` };
      }
    }
    if (typeof config.port !== "number" || config.port < 1 || config.port > 65535) {
      return { isValid: false, error: "端口号必须在 1-65535 之间" };
    }
    const validModes = ["rule", "global", "direct"];
    if (!validModes.includes(config.mode)) {
      return { isValid: false, error: "无效的代理模式" };
    }
    return { isValid: true };
  }
  /**
   * 保存配置URL
   */
  async saveConfigURL(url) {
    try {
      if (window.electronAPI?.config) {
        await window.electronAPI.config.setVpnUrl(url);
      }
    } catch (error) {
      console.warn("保存配置URL失败:", error);
    }
  }
  /**
   * 开始状态监控
   */
  startStatusMonitoring() {
    if (this.statusCheckInterval) {
      return;
    }
    this.statusCheckInterval = setInterval(async () => {
      try {
        await this.getStatus();
      } catch (error) {
        console.warn("状态检查失败:", error);
      }
    }, 5e3);
  }
  /**
   * 停止状态监控
   */
  stopStatusMonitoring() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }
  /**
   * 清理资源
   */
  destroy() {
    this.stopStatusMonitoring();
    this.metricsCache = null;
  }
}
const proxyService = ProxyService.getInstance();
const initialEnhancedState = {
  isRunning: false,
  isLoading: true,
  isConfigLoading: false,
  isConfigSaving: false,
  statusMessage: "",
  isSuccess: false,
  configPath: "",
  configURL: "",
  config: "",
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
  mode: "rule",
  logLevel: "info",
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
  refreshInterval: 1e4
  // 10秒
};
function enhancedProxyReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CONFIG_LOADING":
      return { ...state, isConfigLoading: action.payload };
    case "SET_CONFIG_SAVING":
      return { ...state, isConfigSaving: action.payload };
    case "SET_STATUS_MESSAGE":
      return {
        ...state,
        statusMessage: action.payload.message,
        isSuccess: action.payload.success,
        lastError: action.payload.success ? null : action.payload.message
      };
    case "SET_RUNNING":
      return { ...state, isRunning: action.payload };
    case "SET_CONFIG_PATH":
      return { ...state, configPath: action.payload };
    case "SET_CONFIG_URL":
      return { ...state, configURL: action.payload };
    case "SET_CONFIG":
      return { ...state, config: action.payload };
    case "SET_AUTO_START":
      return { ...state, autoStart: action.payload };
    case "SET_API_AVAILABLE":
      return { ...state, apiAvailable: action.payload };
    case "SET_HAS_CONFIG":
      return { ...state, hasConfig: action.payload };
    case "SET_VALID_CONFIG":
      return { ...state, isValidConfig: action.payload };
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_TUN_MODE":
      return { ...state, tunMode: action.payload };
    case "SET_UNIFIED_DELAY":
      return { ...state, unifiedDelay: action.payload };
    case "SET_TCP_CONCURRENT":
      return { ...state, tcpConcurrent: action.payload };
    case "SET_ENABLE_SNIFFER":
      return { ...state, enableSniffer: action.payload };
    case "SET_PORT":
      return { ...state, port: action.payload };
    case "SET_SOCKS_PORT":
      return { ...state, socksPort: action.payload };
    case "SET_MIXED_PORT":
      return { ...state, mixedPort: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_LOG_LEVEL":
      return { ...state, logLevel: action.payload };
    // 增强的 Actions
    case "SET_CONNECTION_INFO":
      return { ...state, connectionInfo: action.payload };
    case "SET_PROXY_GROUPS":
      return { ...state, proxyGroups: action.payload, isFetchingGroups: false };
    case "SET_LATENCY_DATA":
      return { ...state, latencyData: action.payload, isTestingLatency: false };
    case "SET_METRICS":
      return { ...state, metrics: action.payload };
    case "SET_TESTING_LATENCY":
      return { ...state, isTestingLatency: action.payload };
    case "SET_FETCHING_GROUPS":
      return { ...state, isFetchingGroups: action.payload };
    case "SET_LAST_ERROR":
      return { ...state, lastError: action.payload };
    case "INCREMENT_ERROR_COUNT":
      return { ...state, errorCount: state.errorCount + 1 };
    case "RESET_ERROR_COUNT":
      return { ...state, errorCount: 0 };
    case "SET_AUTO_REFRESH":
      return { ...state, autoRefresh: action.payload };
    case "SET_REFRESH_INTERVAL":
      return { ...state, refreshInterval: action.payload };
    case "UPDATE_PROXY_SELECTION":
      return {
        ...state,
        proxyGroups: state.proxyGroups.map(
          (group) => group.name === action.payload.groupName ? { ...group, now: action.payload.proxyName } : group
        )
      };
    case "RESET_STATE":
      return initialEnhancedState;
    default:
      return state;
  }
}
function useEnhancedProxyState() {
  const [state, dispatch] = reactExports.useReducer(enhancedProxyReducer, initialEnhancedState);
  const refreshIntervalRef = reactExports.useRef(null);
  const mountedRef = reactExports.useRef(true);
  const safeDispatch = reactExports.useCallback((action) => {
    if (mountedRef.current) {
      dispatch(action);
    }
  }, []);
  const handleError = reactExports.useCallback((error) => {
    console.error("ProxyState Error:", error);
    safeDispatch({ type: "SET_LAST_ERROR", payload: error });
    safeDispatch({ type: "INCREMENT_ERROR_COUNT" });
    safeDispatch({ type: "SET_STATUS_MESSAGE", payload: { message: error, success: false } });
  }, [safeDispatch]);
  const handleSuccess = reactExports.useCallback((message) => {
    safeDispatch({ type: "RESET_ERROR_COUNT" });
    safeDispatch({ type: "SET_LAST_ERROR", payload: null });
    safeDispatch({ type: "SET_STATUS_MESSAGE", payload: { message, success: true } });
  }, [safeDispatch]);
  const refreshStatus = reactExports.useCallback(async () => {
    if (!state.apiAvailable) return;
    try {
      const result = await proxyService.getStatus();
      if (result.success && result.data) {
        safeDispatch({ type: "SET_RUNNING", payload: result.data.isRunning });
      } else {
        handleError(result.error || "获取状态失败");
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : "获取状态失败");
    }
  }, [state.apiAvailable, safeDispatch, handleError]);
  const refreshConnectionInfo = reactExports.useCallback(async () => {
    if (!state.apiAvailable) return;
    try {
      const result = await proxyService.getConnectionInfo();
      if (result.success) {
        safeDispatch({ type: "SET_CONNECTION_INFO", payload: result.data });
      }
    } catch (error) {
      console.warn("获取连接信息失败:", error);
    }
  }, [state.apiAvailable, safeDispatch]);
  const refreshProxyGroups = reactExports.useCallback(async () => {
    if (!state.apiAvailable || !state.isRunning) return;
    safeDispatch({ type: "SET_FETCHING_GROUPS", payload: true });
    try {
      const result = await proxyService.getProxyGroups();
      if (result.success && result.data) {
        safeDispatch({ type: "SET_PROXY_GROUPS", payload: result.data });
      } else {
        safeDispatch({ type: "SET_FETCHING_GROUPS", payload: false });
        handleError(result.error || "获取代理组失败");
      }
    } catch (error) {
      safeDispatch({ type: "SET_FETCHING_GROUPS", payload: false });
      handleError(error instanceof Error ? error.message : "获取代理组失败");
    }
  }, [state.apiAvailable, state.isRunning, safeDispatch, handleError]);
  const testAllDelays = reactExports.useCallback(async () => {
    if (!state.apiAvailable || !state.isRunning || state.proxyGroups.length === 0) {
      return;
    }
    safeDispatch({ type: "SET_TESTING_LATENCY", payload: true });
    try {
      const result = await proxyService.testAllProxyDelays();
      if (result.success && result.data) {
        safeDispatch({ type: "SET_LATENCY_DATA", payload: result.data });
        handleSuccess("延迟测试完成");
      } else {
        safeDispatch({ type: "SET_TESTING_LATENCY", payload: false });
        handleError(result.error || "延迟测试失败");
      }
    } catch (error) {
      safeDispatch({ type: "SET_TESTING_LATENCY", payload: false });
      handleError(error instanceof Error ? error.message : "延迟测试失败");
    }
  }, [state.apiAvailable, state.isRunning, state.proxyGroups.length, safeDispatch, handleError, handleSuccess]);
  const refreshMetrics = reactExports.useCallback(async () => {
    if (!state.apiAvailable || !state.isRunning) return;
    try {
      const result = await proxyService.getProxyMetrics();
      if (result.success) {
        safeDispatch({ type: "SET_METRICS", payload: result.data });
      }
    } catch (error) {
      console.warn("获取指标失败:", error);
    }
  }, [state.apiAvailable, state.isRunning, safeDispatch]);
  const startProxy = reactExports.useCallback(async () => {
    if (!state.hasConfig || !state.isValidConfig) {
      handleError("请先获取并验证配置");
      return;
    }
    safeDispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await proxyService.start();
      if (result.success) {
        handleSuccess("代理启动成功");
        safeDispatch({ type: "SET_CURRENT_STEP", payload: 4 });
        await refreshStatus();
        await refreshProxyGroups();
      } else {
        handleError(result.error || "启动失败");
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : "启动失败");
    } finally {
      safeDispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.hasConfig, state.isValidConfig, safeDispatch, handleError, handleSuccess, refreshStatus, refreshProxyGroups]);
  const stopProxy = reactExports.useCallback(async () => {
    safeDispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await proxyService.stop();
      if (result.success) {
        handleSuccess("代理停止成功");
        safeDispatch({ type: "SET_CURRENT_STEP", payload: 3 });
        safeDispatch({ type: "SET_PROXY_GROUPS", payload: [] });
        safeDispatch({ type: "SET_LATENCY_DATA", payload: {} });
        safeDispatch({ type: "SET_METRICS", payload: null });
        await refreshStatus();
      } else {
        handleError(result.error || "停止失败");
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : "停止失败");
    } finally {
      safeDispatch({ type: "SET_LOADING", payload: false });
    }
  }, [safeDispatch, handleError, handleSuccess, refreshStatus]);
  const selectProxy = reactExports.useCallback(async (groupName, proxyName) => {
    try {
      const result = await proxyService.selectProxy(groupName, proxyName);
      if (result.success) {
        safeDispatch({ type: "UPDATE_PROXY_SELECTION", payload: { groupName, proxyName } });
        handleSuccess(`已选择代理: ${proxyName}`);
      } else {
        handleError(result.error || "选择代理失败");
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : "选择代理失败");
    }
  }, [safeDispatch, handleError, handleSuccess]);
  const refreshAll = reactExports.useCallback(async () => {
    await Promise.all([
      refreshStatus(),
      refreshConnectionInfo(),
      refreshProxyGroups(),
      refreshMetrics()
    ]);
  }, [refreshStatus, refreshConnectionInfo, refreshProxyGroups, refreshMetrics]);
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
    const initialize = async () => {
      const apiAvailable = !!(window.electronAPI?.mihomo && window.electronAPI?.config);
      safeDispatch({ type: "SET_API_AVAILABLE", payload: apiAvailable });
      if (apiAvailable) {
        await refreshAll();
        try {
          const urlResult = await window.electronAPI.config.getVpnUrl();
          if (urlResult.success && urlResult.data) {
            safeDispatch({ type: "SET_CONFIG_URL", payload: urlResult.data });
          }
        } catch (error) {
          console.warn("加载配置URL失败:", error);
        }
        try {
          const autoStartResult = await window.electronAPI.config.getProxyAutoStart();
          if (autoStartResult.success && autoStartResult.data !== void 0) {
            safeDispatch({ type: "SET_AUTO_START", payload: autoStartResult.data });
          }
        } catch (error) {
          console.warn("加载自动启动设置失败:", error);
        }
      }
      safeDispatch({ type: "SET_LOADING", payload: false });
    };
    initialize();
  }, [safeDispatch, refreshAll]);
  reactExports.useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);
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
    setLoading: (loading) => safeDispatch({ type: "SET_LOADING", payload: loading }),
    setConfigLoading: (loading) => safeDispatch({ type: "SET_CONFIG_LOADING", payload: loading }),
    setConfigSaving: (saving) => safeDispatch({ type: "SET_CONFIG_SAVING", payload: saving }),
    setStatusMessage: (message, success) => safeDispatch({ type: "SET_STATUS_MESSAGE", payload: { message, success } }),
    setRunning: (running) => safeDispatch({ type: "SET_RUNNING", payload: running }),
    setConfigPath: (path) => safeDispatch({ type: "SET_CONFIG_PATH", payload: path }),
    setConfigURL: (url) => safeDispatch({ type: "SET_CONFIG_URL", payload: url }),
    setConfig: (config) => safeDispatch({ type: "SET_CONFIG", payload: config }),
    setAutoStart: (autoStart) => safeDispatch({ type: "SET_AUTO_START", payload: autoStart }),
    setHasConfig: (hasConfig) => safeDispatch({ type: "SET_HAS_CONFIG", payload: hasConfig }),
    setValidConfig: (valid) => safeDispatch({ type: "SET_VALID_CONFIG", payload: valid }),
    setCurrentStep: (step) => safeDispatch({ type: "SET_CURRENT_STEP", payload: step }),
    setTunMode: (enabled) => safeDispatch({ type: "SET_TUN_MODE", payload: enabled }),
    setUnifiedDelay: (enabled) => safeDispatch({ type: "SET_UNIFIED_DELAY", payload: enabled }),
    setTcpConcurrent: (enabled) => safeDispatch({ type: "SET_TCP_CONCURRENT", payload: enabled }),
    setEnableSniffer: (enabled) => safeDispatch({ type: "SET_ENABLE_SNIFFER", payload: enabled }),
    setPort: (port) => safeDispatch({ type: "SET_PORT", payload: port }),
    setSocksPort: (port) => safeDispatch({ type: "SET_SOCKS_PORT", payload: port }),
    setMixedPort: (port) => safeDispatch({ type: "SET_MIXED_PORT", payload: port }),
    setMode: (mode) => safeDispatch({ type: "SET_MODE", payload: mode }),
    setLogLevel: (level) => safeDispatch({ type: "SET_LOG_LEVEL", payload: level }),
    // 增强操作
    setAutoRefresh: (enabled) => safeDispatch({ type: "SET_AUTO_REFRESH", payload: enabled }),
    setRefreshInterval: (interval) => safeDispatch({ type: "SET_REFRESH_INTERVAL", payload: interval }),
    resetState: () => safeDispatch({ type: "RESET_STATE" })
  };
}
const ErrorContainer = dt.div`
  padding: 2rem;
  text-align: center;
  background: ${(props) => props.theme.surface};
  border-radius: ${(props) => props.theme.borderRadius.large};
  border: 1px solid ${(props) => props.theme.error.main};
  margin: 2rem;
`;
const ErrorTitle = dt.h2`
  color: ${(props) => props.theme.error.main};
  margin-bottom: 1rem;
`;
const ErrorMessage = dt.p`
  color: ${(props) => props.theme.textSecondary};
  margin-bottom: 1rem;
`;
const ErrorDetails = dt.pre`
  background: ${(props) => props.theme.surfaceVariant};
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  text-align: left;
  font-size: 0.875rem;
  overflow-x: auto;
  margin-top: 1rem;
`;
const RetryButton = dt.button`
  background: ${(props) => props.theme.primary.main};
  color: ${(props) => props.theme.primary.contrastText};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  
  &:hover {
    background: ${(props) => props.theme.primary.dark};
  }
`;
class ErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(ErrorContainer, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorTitle, { children: "出现错误" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { children: "抱歉，应用程序遇到了一个错误。请刷新页面或重试。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RetryButton, { onClick: this.handleRetry, children: "重试" }),
        this.state.error && this.state.errorInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(ErrorDetails, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "错误详情:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          this.state.error.toString(),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "组件堆栈:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          this.state.errorInfo.componentStack
        ] })
      ] });
    }
    return this.props.children;
  }
}
const OverviewContainer = dt(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
const MetricCard = dt(motion.div)`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;
const MetricHeader = dt.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;
const MetricIcon = dt.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
`;
const MetricBadge = dt.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  background: ${(props) => {
  switch (props.$variant) {
    case "success":
      return props.theme.success.main + "20";
    case "warning":
      return props.theme.warning.main + "20";
    case "error":
      return props.theme.error.main + "20";
    case "info":
      return props.theme.primary.main + "20";
    default:
      return props.theme.surfaceVariant;
  }
}};
  color: ${(props) => {
  switch (props.$variant) {
    case "success":
      return props.theme.success.main;
    case "warning":
      return props.theme.warning.main;
    case "error":
      return props.theme.error.main;
    case "info":
      return props.theme.primary.main;
    default:
      return props.theme.textSecondary;
  }
}};
`;
const MetricTitle = dt.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => props.theme.textSecondary};
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const MetricValue = dt.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${(props) => props.theme.textPrimary};
  margin-bottom: 0.5rem;
  line-height: 1;
`;
const MetricSubtext = dt.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;
const ConnectionGrid = dt.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
`;
const PortInfo = dt.div`
  text-align: center;
  padding: 0.75rem;
  background: ${(props) => props.theme.surfaceVariant};
  border-radius: 8px;
`;
const PortLabel = dt.div`
  font-size: 0.7rem;
  color: ${(props) => props.theme.textSecondary};
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  font-weight: 600;
`;
const PortValue = dt.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
`;
const ProgressBar = dt.div`
  width: 100%;
  height: 4px;
  background: ${(props) => props.theme.surfaceVariant};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.75rem;
`;
const ProgressFill = dt(motion.div)`
  height: 100%;
  background: ${(props) => props.$color};
  border-radius: 2px;
`;
const PulseIndicator = dt(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.$color};
  box-shadow: 0 0 12px ${(props) => props.$color}50;
`;
const ProxyOverview = ({
  isRunning,
  connectionInfo,
  metrics,
  isLoading = false
}) => {
  const getHealthScore = () => {
    if (!metrics) return 0;
    if (metrics.totalProxies === 0) return 0;
    return Math.round(metrics.healthyProxies / metrics.totalProxies * 100);
  };
  const getHealthVariant = (score) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };
  const getDelayVariant = (delay) => {
    if (delay < 100) return "success";
    if (delay < 300) return "warning";
    return "error";
  };
  const formatUptime = (uptime) => {
    if (!uptime) return "未知";
    const hours = Math.floor(uptime / 36e5);
    const minutes = Math.floor(uptime % 36e5 / 6e4);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    OverviewContainer,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          MetricCard,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.1 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(MetricHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MetricIcon, { $color: isRunning ? "#10B981" : "#EF4444", children: isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 24 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(MetricBadge, { $variant: isRunning ? "success" : "error", children: isRunning ? "运行中" : "已停止" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MetricTitle, { children: "连接状态" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MetricValue, { children: isRunning ? "已连接" : "未连接" }),
              isRunning && connectionInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(MetricSubtext, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14 }),
                "运行时间: ",
                formatUptime(connectionInfo.uptime)
              ] }),
              connectionInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(ConnectionGrid, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(PortInfo, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PortLabel, { children: "HTTP" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PortValue, { children: connectionInfo.httpPort })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(PortInfo, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PortLabel, { children: "SOCKS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PortValue, { children: connectionInfo.socksPort })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(PortInfo, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PortLabel, { children: "MIXED" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PortValue, { children: connectionInfo.mixedPort })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          MetricCard,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.2 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(MetricHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MetricIcon, { $color: "#3B82F6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 24 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PulseIndicator,
                  {
                    $color: "#3B82F6",
                    animate: {
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    },
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MetricTitle, { children: "代理节点" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MetricValue, { children: isLoading ? "..." : metrics?.totalProxies || 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(MetricSubtext, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }),
                "活跃: ",
                metrics?.activeProxies || 0,
                " 个节点"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          MetricCard,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.3 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(MetricHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MetricIcon, { $color: "#F59E0B", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 24 }) }),
                metrics?.avgDelay && /* @__PURE__ */ jsxRuntimeExports.jsx(MetricBadge, { $variant: getDelayVariant(metrics.avgDelay), children: metrics.avgDelay < 100 ? "优秀" : metrics.avgDelay < 300 ? "良好" : "较慢" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MetricTitle, { children: "平均延迟" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MetricValue, { children: isLoading ? "..." : metrics?.avgDelay ? `${metrics.avgDelay}ms` : "N/A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(MetricSubtext, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { size: 14 }),
                "基于 ",
                metrics?.healthyProxies || 0,
                " 个健康节点"
              ] }),
              metrics?.avgDelay && /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ProgressFill,
                {
                  $color: metrics.avgDelay < 100 ? "#10B981" : metrics.avgDelay < 300 ? "#F59E0B" : "#EF4444",
                  $value: Math.min(metrics.avgDelay / 500 * 100, 100),
                  initial: { width: 0 },
                  animate: { width: `${Math.min(metrics.avgDelay / 500 * 100, 100)}%` },
                  transition: { duration: 1, delay: 0.5 }
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          MetricCard,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.4 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(MetricHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MetricIcon, { $color: "#10B981", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 24 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(MetricBadge, { $variant: getHealthVariant(getHealthScore()), children: getHealthScore() >= 80 ? "健康" : getHealthScore() >= 50 ? "一般" : "不良" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MetricTitle, { children: "网络健康度" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MetricValue, { children: isLoading ? "..." : `${getHealthScore()}%` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(MetricSubtext, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
                metrics?.healthyProxies || 0,
                " / ",
                metrics?.totalProxies || 0,
                " 节点正常"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ProgressFill,
                {
                  $color: getHealthScore() >= 80 ? "#10B981" : getHealthScore() >= 50 ? "#F59E0B" : "#EF4444",
                  $value: getHealthScore(),
                  initial: { width: 0 },
                  animate: { width: `${getHealthScore()}%` },
                  transition: { duration: 1, delay: 0.6 }
                }
              ) })
            ]
          }
        )
      ]
    }
  );
};
const StatusCard = dt(motion.div)`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.large};
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;
const StatusContent = dt.div`
  flex: 1;
`;
const StatusTitle = dt.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin: 0 0 0.5rem 0;
`;
const StatusDescription = dt.p`
  color: ${(props) => props.theme.textSecondary};
  margin: 0;
  font-size: 0.9rem;
`;
const ControlButtonGroup = dt.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;
const ControlButton = dt(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  ${(props) => {
  switch (props.$variant) {
    case "primary":
      return `
          background: ${props.theme.primary.main};
          color: ${props.theme.primary.contrastText};
          &:hover:not(:disabled) {
            background: ${props.theme.primary.dark};
          }
        `;
    case "danger":
      return `
          background: ${props.theme.error.main};
          color: ${props.theme.error.contrastText};
          &:hover:not(:disabled) {
            background: ${props.theme.error.dark};
          }
        `;
    case "outline":
      return `
          background: transparent;
          color: ${props.theme.primary.main};
          border: 1px solid ${props.theme.primary.main};
          &:hover:not(:disabled) {
            background: ${props.theme.primary.main};
            color: ${props.theme.primary.contrastText};
          }
        `;
    default:
      return "";
  }
}}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const ProxyStatus = reactExports.memo(({
  isRunning,
  isLoading,
  onStart,
  onStop,
  onTestLatency,
  hasConfig,
  isValidConfig
}) => {
  useTheme();
  const statusText = reactExports.useMemo(() => {
    if (isLoading) return "🔄 正在检查状态...";
    return isRunning ? "🟢 Mihomo 代理服务正在运行" : "🔴 Mihomo 代理服务已停止";
  }, [isLoading, isRunning]);
  const startButtonTooltip = reactExports.useMemo(() => {
    if (isRunning) return "代理正在运行中";
    if (isLoading) return "正在处理中，请稍候";
    if (!hasConfig) return "请先获取配置";
    if (!isValidConfig) return "配置无效，请检查配置";
    return "启动 Mihomo 代理服务";
  }, [isRunning, isLoading, hasConfig, isValidConfig]);
  const isStartDisabled = reactExports.useMemo(() => isRunning || isLoading || !hasConfig || !isValidConfig, [isRunning, isLoading, hasConfig, isValidConfig]);
  const isStopDisabled = reactExports.useMemo(() => !isRunning || isLoading, [isRunning, isLoading]);
  const isTestDisabled = reactExports.useMemo(() => !isRunning || isLoading, [isRunning, isLoading]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    StatusCard,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIndicator, { status: isRunning ? "success" : "error", size: "small" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(StatusContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTitle, { children: "代理服务状态" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDescription, { children: statusText })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ControlButtonGroup, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            ControlButton,
            {
              $variant: "primary",
              onClick: onStart,
              disabled: isStartDisabled,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              title: startButtonTooltip,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 16 }),
                isRunning ? "运行中" : "启动代理"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            ControlButton,
            {
              $variant: "danger",
              onClick: onStop,
              disabled: isStopDisabled,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16 }),
                "停止代理"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            ControlButton,
            {
              $variant: "outline",
              onClick: onTestLatency,
              disabled: isTestDisabled,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 16 }),
                "测试延迟"
              ]
            }
          )
        ] })
      ]
    }
  );
});
ProxyStatus.displayName = "ProxyStatus";
const StepContainer = dt.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${(props) => props.theme.surface};
  border-radius: ${(props) => props.theme.borderRadius.large};
  border: 1px solid ${(props) => props.theme.border};
`;
const StepHeader = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;
const StepTitle = dt.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
  margin: 0;
`;
const StepDescription = dt.p`
  color: ${(props) => props.theme.textSecondary};
  margin: 0;
  font-size: 1rem;
`;
const StepIndicator = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;
const Step = dt(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.large};
  background: ${(props) => props.$completed ? props.theme.success.main : props.$active ? props.theme.primary.main : props.theme.surfaceVariant};
  color: ${(props) => props.$completed || props.$active ? "#FFFFFF" : props.theme.textSecondary};
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: ${(props) => props.$completed || props.$active ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none"};
  min-width: 150px;
  justify-content: center;
`;
const StepIcon = dt.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const WorkflowSteps = reactExports.memo(({ currentStep }) => {
  const steps = reactExports.useMemo(() => [
    {
      id: 1,
      title: "设置提供者",
      icon: Settings,
      description: "配置 VPN 提供者 URL"
    },
    {
      id: 2,
      title: "获取配置",
      icon: Download,
      description: "从 URL 下载配置文件"
    },
    {
      id: 3,
      title: "验证配置",
      icon: Shield,
      description: "检查配置文件有效性"
    },
    {
      id: 4,
      title: "启动代理",
      icon: Play,
      description: "启动 Mihomo 代理服务"
    }
  ], []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(StepContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(StepHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 24 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepTitle, { children: "设置工作流" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepDescription, { children: "按照以下步骤配置并启动您的代理服务" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { children: steps.map((step, index) => {
      const isActive = currentStep === step.id;
      const isCompleted = currentStep > step.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Step,
        {
          $active: isActive,
          $completed: isCompleted,
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.1 * index },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StepIcon, { children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(step.icon, { size: 16 }) }),
            isCompleted ? step.title : isActive ? step.title : `步骤 ${step.id}`
          ]
        },
        step.id
      );
    }) })
  ] });
});
WorkflowSteps.displayName = "WorkflowSteps";
const ConfigCard = dt(motion.div)`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.large};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;
const ConfigHeader = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;
const ConfigTitle = dt.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const URLInputContainer = dt.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: end;
`;
const URLInput = dt.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  background: ${(props) => props.theme.surfaceVariant};
  color: ${(props) => props.theme.textPrimary};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary.main};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const ConfigTextArea = dt.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  background: ${(props) => props.theme.surfaceVariant};
  color: ${(props) => props.theme.textPrimary};
  font-family: 'Fira Code', 'Consolas', 'Menlo', monospace;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 300px;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary.main};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const ConfigActions = dt.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;
const ActionButton = dt(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  ${(props) => {
  switch (props.$variant) {
    case "primary":
      return `
          background: ${props.theme.primary.main};
          color: ${props.theme.primary.contrastText};
          &:hover:not(:disabled) {
            background: ${props.theme.primary.dark};
          }
        `;
    case "outline":
      return `
          background: transparent;
          color: ${props.theme.primary.main};
          border: 1px solid ${props.theme.primary.main};
          &:hover:not(:disabled) {
            background: ${props.theme.primary.main};
            color: ${props.theme.primary.contrastText};
          }
        `;
    case "danger":
      return `
          background: ${props.theme.error.main};
          color: ${props.theme.error.contrastText};
          &:hover:not(:disabled) {
            background: ${props.theme.error.dark};
          }
        `;
    default:
      return "";
  }
}}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const ConfigPathDisplay = dt.div`
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  background: ${(props) => props.theme.surfaceVariant};
  font-size: 0.9rem;
  color: ${(props) => props.theme.textPrimary};
  margin-top: 1rem;
`;
const ValidationStatus = dt.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  background: ${(props) => props.theme.surfaceVariant};
  margin-top: 1rem;
  
  ${(props) => props.isValid ? `
    border: 1px solid ${props.theme.success.main};
    color: ${props.theme.success.main};
  ` : `
    border: 1px solid ${props.theme.error.main};
    color: ${props.theme.error.main};
  `}
`;
const ConfigInfo = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: ${(props) => props.theme.textSecondary};
`;
const ConfigFormatHint = dt.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme.textSecondary};
  margin-top: 0.5rem;
  font-style: italic;
`;
const ConfigManager = reactExports.memo(({
  configURL,
  config,
  configPath,
  isValidConfig,
  isConfigLoading,
  isConfigSaving,
  onConfigURLChange,
  onConfigChange,
  onFetchConfig,
  onSaveConfig,
  onLoadConfig,
  onOpenConfigDir
}) => {
  useTheme();
  const handleConfigURLChange = reactExports.useCallback((e) => {
    onConfigURLChange(e.target.value);
  }, [onConfigURLChange]);
  const handleConfigChange = reactExports.useCallback((e) => {
    onConfigChange(e.target.value);
  }, [onConfigChange]);
  const isFetchDisabled = reactExports.useMemo(() => isConfigLoading || isConfigSaving || !configURL.trim(), [isConfigLoading, isConfigSaving, configURL]);
  const isSaveDisabled = reactExports.useMemo(() => isConfigLoading || isConfigSaving || !config.trim(), [isConfigLoading, isConfigSaving, config]);
  const isLoadDisabled = reactExports.useMemo(() => isConfigLoading || isConfigSaving, [isConfigLoading, isConfigSaving]);
  const validationMessage = reactExports.useMemo(() => {
    if (isConfigLoading) {
      return "📥 正在获取配置...";
    }
    if (isConfigSaving) {
      return "💾 正在保存配置...";
    }
    if (!config.trim()) {
      return "⚠️ 配置为空，请获取或输入配置";
    }
    return isValidConfig ? "✓ 配置有效，可以使用" : "✗ 配置格式无效，请检查 YAML 语法";
  }, [isValidConfig, config, isConfigLoading, isConfigSaving]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ConfigCard,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ConfigHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ConfigTitle, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 20 }),
          "配置管理"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(URLInputContainer, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            URLInput,
            {
              type: "text",
              value: configURL,
              onChange: handleConfigURLChange,
              placeholder: "输入 VPN 提供者配置 URL...",
              disabled: isConfigLoading || isConfigSaving
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            ActionButton,
            {
              $variant: "primary",
              onClick: onFetchConfig,
              disabled: isFetchDisabled,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              children: [
                isConfigLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
                isConfigLoading ? "获取中..." : "获取配置"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConfigTextArea,
          {
            value: config,
            onChange: handleConfigChange,
            placeholder: "在此输入您的 Mihomo 配置（YAML 格式）...",
            disabled: isConfigLoading || isConfigSaving
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ConfigInfo, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "字符数: ",
            config.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "行数: ",
            config.split("\n").length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ConfigFormatHint, { children: "💡 提示：配置文件应为 YAML 格式，包含端口、代理规则等设置" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ConfigActions, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            ActionButton,
            {
              $variant: "outline",
              onClick: onLoadConfig,
              disabled: isLoadDisabled,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
                "重新加载"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            ActionButton,
            {
              $variant: "primary",
              onClick: onSaveConfig,
              disabled: isSaveDisabled,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
                isConfigSaving ? "保存中..." : "保存配置"
              ]
            }
          ),
          configPath && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            ActionButton,
            {
              $variant: "outline",
              onClick: onOpenConfigDir,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 16 }),
                "打开目录"
              ]
            }
          )
        ] }),
        configPath && /* @__PURE__ */ jsxRuntimeExports.jsxs(ConfigPathDisplay, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "配置路径:" }),
          " ",
          configPath
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ValidationStatus, { isValid: isValidConfig, children: validationMessage })
      ]
    }
  );
});
ConfigManager.displayName = "ConfigManager";
const AdvancedSettingsCard = dt(motion.div)`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.large};
  padding: 1.5rem;
  margin-top: 1.5rem;
`;
const SettingsHeader = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;
const SettingsTitle = dt.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin: 0;
`;
const SettingsDescription = dt.p`
  color: ${(props) => props.theme.textSecondary};
  margin: 0;
  font-size: 0.9rem;
`;
const SettingRow = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;
const SettingLabel = dt.label`
  flex: 1;
  color: ${(props) => props.theme.textPrimary};
  font-weight: 500;
`;
const Checkbox = dt.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${(props) => props.theme.primary.main};
`;
const InputGroup = dt.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;
const InputField = dt.div`
  flex: 1;
  min-width: 120px;
`;
const FieldLabel = dt.label`
  display: block;
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;
const Input = dt.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  background: ${(props) => props.theme.surfaceVariant};
  color: ${(props) => props.theme.textPrimary};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary.main};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;
const Select = dt.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  background: ${(props) => props.theme.surfaceVariant};
  color: ${(props) => props.theme.textPrimary};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary.main};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;
const AutoStartContainer = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  background: ${(props) => props.theme.surfaceVariant};
  margin-bottom: 1.5rem;
`;
const AdvancedSettings = reactExports.memo(({
  autoStart,
  tunMode,
  unifiedDelay,
  tcpConcurrent,
  enableSniffer,
  port,
  socksPort,
  mixedPort,
  mode,
  logLevel,
  onAutoStartChange,
  onTunModeChange,
  onUnifiedDelayChange,
  onTcpConcurrentChange,
  onEnableSnifferChange,
  onPortChange,
  onSocksPortChange,
  onMixedPortChange,
  onModeChange,
  onLogLevelChange
}) => {
  const handleAutoStartChange = reactExports.useCallback((e) => {
    onAutoStartChange(e.target.checked);
  }, [onAutoStartChange]);
  const handleTunModeChange = reactExports.useCallback((e) => {
    onTunModeChange(e.target.checked);
  }, [onTunModeChange]);
  const handleUnifiedDelayChange = reactExports.useCallback((e) => {
    onUnifiedDelayChange(e.target.checked);
  }, [onUnifiedDelayChange]);
  const handleTcpConcurrentChange = reactExports.useCallback((e) => {
    onTcpConcurrentChange(e.target.checked);
  }, [onTcpConcurrentChange]);
  const handleEnableSnifferChange = reactExports.useCallback((e) => {
    onEnableSnifferChange(e.target.checked);
  }, [onEnableSnifferChange]);
  const handlePortChange = reactExports.useCallback((e) => {
    onPortChange(Number(e.target.value));
  }, [onPortChange]);
  const handleSocksPortChange = reactExports.useCallback((e) => {
    onSocksPortChange(Number(e.target.value));
  }, [onSocksPortChange]);
  const handleMixedPortChange = reactExports.useCallback((e) => {
    onMixedPortChange(Number(e.target.value));
  }, [onMixedPortChange]);
  const handleModeChange = reactExports.useCallback((e) => {
    onModeChange(e.target.value);
  }, [onModeChange]);
  const handleLogLevelChange = reactExports.useCallback((e) => {
    onLogLevelChange(e.target.value);
  }, [onLogLevelChange]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AdvancedSettingsCard,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 0.2 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsTitle, { children: "高级设置" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsDescription, { children: "调整代理配置以获得最佳性能" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AutoStartContainer, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              type: "checkbox",
              checked: autoStart,
              onChange: handleAutoStartChange
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingLabel, { children: "应用程序启动时自动启动代理" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              type: "checkbox",
              checked: tunMode,
              onChange: handleTunModeChange
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingLabel, { children: "TUN 模式（系统代理）" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              type: "checkbox",
              checked: unifiedDelay,
              onChange: handleUnifiedDelayChange
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingLabel, { children: "统一延迟" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              type: "checkbox",
              checked: tcpConcurrent,
              onChange: handleTcpConcurrentChange
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingLabel, { children: "TCP 并发" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              type: "checkbox",
              checked: enableSniffer,
              onChange: handleEnableSnifferChange
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingLabel, { children: "启用嗅探器" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(InputField, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "端口" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: port,
                onChange: handlePortChange,
                min: "1",
                max: "65535"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(InputField, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "SOCKS 端口" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: socksPort,
                onChange: handleSocksPortChange,
                min: "1",
                max: "65535"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(InputField, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "混合端口" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: mixedPort,
                onChange: handleMixedPortChange,
                min: "1",
                max: "65535"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup, { style: { marginTop: "1rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(InputField, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "模式" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: mode, onChange: handleModeChange, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rule", children: "规则" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "global", children: "全局" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "direct", children: "直连" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(InputField, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "日志级别" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: logLevel, onChange: handleLogLevelChange, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "silent", children: "静默" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "error", children: "错误" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "warning", children: "警告" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "info", children: "信息" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "debug", children: "调试" })
            ] })
          ] })
        ] })
      ]
    }
  );
});
AdvancedSettings.displayName = "AdvancedSettings";
const Container$1 = dt(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const Header = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;
const HeaderLeft = dt.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const Title = dt.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const Subtitle = dt.p`
  color: ${(props) => props.theme.textSecondary};
  margin: 0;
  font-size: 0.9rem;
`;
const HeaderRight = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const Controls = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;
const SearchBox = dt.div`
  position: relative;
  min-width: 200px;
`;
const SearchInput = dt.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 12px;
  background: ${(props) => props.theme.surface};
  color: ${(props) => props.theme.textPrimary};
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary.main};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primary.main}20;
  }
  
  &::placeholder {
    color: ${(props) => props.theme.textSecondary};
  }
`;
const SearchIcon = dt.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.textSecondary};
`;
const FilterDropdown = dt.div`
  position: relative;
`;
const FilterButton = dt.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => props.$active ? props.theme.primary.main : props.theme.border};
  border-radius: 12px;
  background: ${(props) => props.$active ? props.theme.primary.main + "20" : props.theme.surface};
  color: ${(props) => props.$active ? props.theme.primary.main : props.theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => props.theme.surfaceVariant};
  }
`;
const SortButton = dt(FilterButton)``;
const GroupsList = dt.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const GroupCard = dt(motion.div)`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;
const GroupHeader = dt.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: ${(props) => props.theme.surface};
  border-bottom: 1px solid ${(props) => props.theme.border};
  cursor: pointer;
`;
const GroupInfo = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;
const GroupIcon = dt.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
`;
const GroupDetails = dt.div`
  flex: 1;
`;
const GroupName = dt.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin: 0 0 0.5rem 0;
`;
const GroupMeta = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;
const GroupType = dt.span`
  font-size: 0.8rem;
  color: ${(props) => props.theme.textSecondary};
  background: ${(props) => props.theme.surfaceVariant};
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
`;
const GroupStats = dt.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.85rem;
`;
const StatItem = dt.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;
const CurrentProxy = dt.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${(props) => props.theme.primary.main}10;
  border: 1px solid ${(props) => props.theme.primary.main}30;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) => props.theme.primary.main};
`;
const ExpandButton = dt.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${(props) => props.theme.surfaceVariant};
  border-radius: 8px;
  color: ${(props) => props.theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => props.theme.border};
    transform: scale(1.05);
  }
`;
const GroupContent = dt(motion.div)`
  padding: 1.5rem;
  background: ${(props) => props.theme.background};
`;
const ProxiesGrid = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
`;
const ProxyCard = dt(motion.div)`
  background: ${(props) => props.$selected ? props.theme.primary.main : props.theme.surface};
  border: 1px solid ${(props) => {
  if (props.$selected) return props.theme.primary.main;
  if (props.$isHealthy === false) return props.theme.error.main;
  return props.theme.border;
}};
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  ${(props) => props.$selected && `
    color: white;
  `}
  
  ${(props) => props.$delay !== void 0 && `
    &::after {
      content: '${props.$delay}ms';
      position: absolute;
      top: 8px;
      right: 8px;
      background: ${props.$delay < 100 ? "#10B981" : props.$delay < 300 ? "#F59E0B" : "#EF4444"};
      color: white;
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 6px;
      font-weight: 600;
    }
  `}
`;
const ProxyContent = dt.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const ProxyIndicator = dt.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => {
  if (props.$selected) return "rgba(255, 255, 255, 0.8)";
  if (props.$isHealthy === false) return props.theme.error.main;
  if (props.$isHealthy === true) return props.theme.success.main;
  return props.theme.surfaceVariant;
}};
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${(props) => props.$selected && `
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `}
`;
const ProxyName = dt.span`
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;
const NoResults = dt(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  color: ${(props) => props.theme.textSecondary};
`;
const LoadingIndicator = dt.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: ${(props) => props.theme.textSecondary};
`;
const SpinIcon = dt(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const EnhancedProxyGroupManager = ({
  groups,
  latencyData,
  isLoading = false,
  isTestingLatency = false,
  onSelectProxy,
  onTestLatency,
  onRefreshGroups
}) => {
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [sortBy] = reactExports.useState("name");
  const [filterBy] = reactExports.useState("all");
  const [expandedGroups, setExpandedGroups] = reactExports.useState(/* @__PURE__ */ new Set());
  const filteredAndSortedGroups = reactExports.useMemo(() => {
    const filtered = groups.filter((group) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = group.name.toLowerCase().includes(query);
        const matchesProxy = group.proxies.some(
          (proxy) => proxy.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesProxy) return false;
      }
      switch (filterBy) {
        case "active":
          return !!group.now;
        case "healthy":
          return group.proxies.some((proxy) => {
            const delay = latencyData[proxy];
            return delay && delay > 0;
          });
        case "unhealthy":
          return group.proxies.some((proxy) => {
            const delay = latencyData[proxy];
            return delay === -1 || delay === void 0;
          });
        default:
          return true;
      }
    });
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "type":
          return a.type.localeCompare(b.type);
        case "proxies":
          return b.proxies.length - a.proxies.length;
        case "current":
          if (a.now && !b.now) return -1;
          if (!a.now && b.now) return 1;
          return 0;
        default:
          return 0;
      }
    });
    return filtered;
  }, [groups, searchQuery, sortBy, filterBy, latencyData]);
  const toggleGroupExpansion = reactExports.useCallback((groupName) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  }, [expandedGroups]);
  const getProxyHealthStatus = reactExports.useCallback((proxyName) => {
    const delay = latencyData[proxyName];
    if (delay === void 0) return void 0;
    return delay > 0;
  }, [latencyData]);
  const getSortLabel = reactExports.useCallback((sort) => {
    switch (sort) {
      case "name":
        return "名称";
      case "type":
        return "类型";
      case "proxies":
        return "节点数";
      case "current":
        return "当前选择";
      default:
        return "名称";
    }
  }, []);
  const getFilterLabel = reactExports.useCallback((filter) => {
    switch (filter) {
      case "all":
        return "全部";
      case "active":
        return "活跃";
      case "healthy":
        return "健康";
      case "unhealthy":
        return "异常";
      default:
        return "全部";
    }
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Container$1,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Header, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(HeaderLeft, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 24 }),
              "代理组管理"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Subtitle, { children: "管理和配置您的代理服务器组，选择最优节点" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(HeaderRight, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "small",
                onClick: onRefreshGroups,
                disabled: isLoading,
                startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
                children: "刷新"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "small",
                onClick: onTestLatency,
                disabled: isTestingLatency || groups.length === 0,
                startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
                children: isTestingLatency ? "测试中..." : "测试延迟"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Controls, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SearchBox, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIcon, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SearchInput,
              {
                placeholder: "搜索代理组或节点...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FilterDropdown, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterButton, { $active: filterBy !== "all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 16 }),
            getFilterLabel(filterBy),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SortButton, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { size: 16 }),
            getSortLabel(sortBy),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 })
          ] })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(LoadingIndicator, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SpinIcon,
            {
              animate: { rotate: 360 },
              transition: { duration: 1, repeat: Infinity, ease: "linear" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20 })
            }
          ),
          "加载代理组..."
        ] }) : filteredAndSortedGroups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          NoResults,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.2 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 48, style: { opacity: 0.3, marginBottom: "1rem" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }, children: searchQuery || filterBy !== "all" ? "未找到匹配的代理组" : "未找到代理组" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.9rem" }, children: searchQuery || filterBy !== "all" ? "尝试调整搜索条件或过滤器" : "启动代理服务并加载配置以查看代理组" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(GroupsList, { children: filteredAndSortedGroups.map((group, index) => {
          const isExpanded = expandedGroups.has(group.name);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            GroupCard,
            {
              $isExpanded: isExpanded,
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.1 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(GroupHeader, { onClick: () => toggleGroupExpansion(group.name), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(GroupInfo, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(GroupIcon, { $color: "#3B82F6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 20 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(GroupDetails, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(GroupName, { children: group.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(GroupMeta, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(GroupType, { children: group.type }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(GroupStats, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(StatItem, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 14 }),
                            group.proxies.length,
                            " 节点"
                          ] }),
                          group.now && /* @__PURE__ */ jsxRuntimeExports.jsxs(StatItem, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 14 }),
                            group.now
                          ] })
                        ] })
                      ] })
                    ] })
                  ] }),
                  group.now && /* @__PURE__ */ jsxRuntimeExports.jsxs(CurrentProxy, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16 }),
                    group.now
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExpandButton, { children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GroupContent,
                  {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: "auto", opacity: 1 },
                    exit: { height: 0, opacity: 0 },
                    transition: { duration: 0.3 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProxiesGrid, { children: reactExports.useMemo(() => group.proxies.map((proxyName) => {
                      const delay = latencyData[proxyName];
                      const isSelected = group.now === proxyName;
                      const isHealthy = getProxyHealthStatus(proxyName);
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ProxyCard,
                        {
                          $selected: isSelected,
                          $delay: delay > 0 ? delay : void 0,
                          $isHealthy: isHealthy,
                          onClick: () => onSelectProxy(group.name, proxyName),
                          whileHover: { scale: 1.02 },
                          whileTap: { scale: 0.98 },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ProxyContent, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              ProxyIndicator,
                              {
                                $selected: isSelected,
                                $isHealthy: isHealthy
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ProxyName, { children: proxyName })
                          ] })
                        },
                        proxyName
                      );
                    }), [group.proxies, latencyData, group.now, getProxyHealthStatus, onSelectProxy]) })
                  }
                ) })
              ]
            },
            group.name
          );
        }) })
      ]
    }
  );
};
const Container = dt.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  max-width: 1400px;
  margin: 0 auto;
`;
const StatusMessageContainer = dt(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  background: ${(props) => props.theme.surfaceVariant};
  margin-bottom: 1rem;
  
  ${(props) => props.$isSuccess ? `
    border: 1px solid ${props.theme.success.main};
    background: ${props.theme.success.main}10;
    color: ${props.theme.success.main};
  ` : `
    border: 1px solid ${props.theme.error.main};
    background: ${props.theme.error.main}10;
    color: ${props.theme.error.main};
  `}
`;
const StatusIcon = dt.div`
  font-size: 1.2rem;
  font-weight: bold;
`;
const StatusText = dt.div`
  font-size: 0.9rem;
  font-weight: 500;
`;
const SectionContainer = dt(motion.div)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
const RestructuredProxyManager = () => {
  const {
    state,
    startProxy,
    stopProxy,
    selectProxy,
    testAllDelays,
    refreshProxyGroups,
    setConfigURL,
    setConfig,
    setAutoStart,
    setTunMode,
    setUnifiedDelay,
    setTcpConcurrent,
    setEnableSniffer,
    setPort,
    setSocksPort,
    setMixedPort,
    setMode,
    setLogLevel
  } = useEnhancedProxyState();
  const fetchConfigFromURL = async () => {
    if (!state.configURL.trim()) {
      return;
    }
    try {
      const result = await proxyService.fetchConfigFromURL(state.configURL);
      if (result.success && result.data) {
        const yamlStr = dump(result.data);
        setConfig(yamlStr);
        const configObj = result.data;
        if (configObj) {
          setTunMode(!!configObj.tun);
          setUnifiedDelay(configObj["unified-delay"] || false);
          setTcpConcurrent(configObj["tcp-concurrent"] || false);
          setEnableSniffer(configObj.sniffer?.enable || false);
          setPort(configObj.port || 7890);
          setSocksPort(configObj["socks-port"] || 7891);
          setMixedPort(configObj["mixed-port"] || 7892);
          setMode(configObj.mode || "rule");
          setLogLevel(configObj["log-level"] || "info");
        }
      }
    } catch (error) {
      console.error("获取配置失败:", error);
    }
  };
  const saveConfig = async () => {
    if (!state.config.trim()) {
      return;
    }
    try {
      const configObj = load(state.config) || {};
      if (state.tunMode) {
        configObj.tun = {
          enable: true,
          stack: "system",
          "dns-hijack": ["any:53"],
          "auto-route": true,
          "auto-detect-interface": true
        };
      } else {
        delete configObj.tun;
      }
      configObj["unified-delay"] = state.unifiedDelay;
      configObj["tcp-concurrent"] = state.tcpConcurrent;
      if (state.enableSniffer) {
        configObj.sniffer = {
          enable: true,
          "parse-pure-ip": true
        };
      } else {
        delete configObj.sniffer;
      }
      configObj.port = state.port;
      configObj["socks-port"] = state.socksPort;
      configObj["mixed-port"] = state.mixedPort;
      configObj.mode = state.mode;
      configObj["log-level"] = state.logLevel;
      const result = await proxyService.saveConfig(configObj);
      if (result.success) {
        const yamlStr = dump(configObj);
        setConfig(yamlStr);
      }
    } catch (error) {
      console.error("保存配置失败:", error);
    }
  };
  const loadConfig = async () => {
    try {
      const result = await proxyService.getConfig();
      if (result.success && result.data) {
        const yamlStr = dump(result.data);
        setConfig(yamlStr);
        const configObj = result.data;
        if (configObj) {
          setTunMode(!!configObj.tun);
          setUnifiedDelay(configObj["unified-delay"] || false);
          setTcpConcurrent(configObj["tcp-concurrent"] || false);
          setEnableSniffer(configObj.sniffer?.enable || false);
          setPort(configObj.port || 7890);
          setSocksPort(configObj["socks-port"] || 7891);
          setMixedPort(configObj["mixed-port"] || 7892);
          setMode(configObj.mode || "rule");
          setLogLevel(configObj["log-level"] || "info");
        }
      }
    } catch (error) {
      console.error("加载配置失败:", error);
    }
  };
  const handleAutoStartChange = async (checked) => {
    if (!state.apiAvailable) return;
    try {
      const result = await window.electronAPI.config.setProxyAutoStart(checked);
      if (result.success) {
        setAutoStart(checked);
      }
    } catch (error) {
      console.error("更新自动启动设置失败:", error);
    }
  };
  const openConfigDirectory = async () => {
    if (!state.apiAvailable) return;
    try {
      await window.electronAPI.mihomo.openConfigDir();
    } catch (error) {
      console.error("打开配置目录失败:", error);
    }
  };
  reactExports.useEffect(() => {
    if (state.apiAvailable && state.isRunning) {
      refreshProxyGroups();
    }
  }, [state.apiAvailable, state.isRunning, refreshProxyGroups]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Container, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProxyOverview,
      {
        isRunning: state.isRunning,
        connectionInfo: state.connectionInfo,
        metrics: state.metrics,
        isLoading: state.isLoading
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionContainer,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(WorkflowSteps, { currentStep: state.currentStep })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionContainer,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProxyStatus,
          {
            isRunning: state.isRunning,
            isLoading: state.isLoading,
            onStart: startProxy,
            onStop: stopProxy,
            onTestLatency: testAllDelays,
            hasConfig: state.hasConfig,
            isValidConfig: state.isValidConfig
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionContainer,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConfigManager,
          {
            configURL: state.configURL,
            config: state.config,
            configPath: state.configPath,
            isValidConfig: state.isValidConfig,
            isConfigLoading: state.isConfigLoading,
            isConfigSaving: state.isConfigSaving,
            onConfigURLChange: setConfigURL,
            onConfigChange: setConfig,
            onFetchConfig: fetchConfigFromURL,
            onSaveConfig: saveConfig,
            onLoadConfig: loadConfig,
            onOpenConfigDir: openConfigDirectory
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionContainer,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.4 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          AdvancedSettings,
          {
            autoStart: state.autoStart,
            tunMode: state.tunMode,
            unifiedDelay: state.unifiedDelay,
            tcpConcurrent: state.tcpConcurrent,
            enableSniffer: state.enableSniffer,
            port: state.port,
            socksPort: state.socksPort,
            mixedPort: state.mixedPort,
            mode: state.mode,
            logLevel: state.logLevel,
            onAutoStartChange: handleAutoStartChange,
            onTunModeChange: setTunMode,
            onUnifiedDelayChange: setUnifiedDelay,
            onTcpConcurrentChange: setTcpConcurrent,
            onEnableSnifferChange: setEnableSniffer,
            onPortChange: setPort,
            onSocksPortChange: setSocksPort,
            onMixedPortChange: setMixedPort,
            onModeChange: setMode,
            onLogLevelChange: setLogLevel
          }
        )
      }
    ),
    state.isRunning && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionContainer,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.5 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EnhancedProxyGroupManager,
          {
            groups: state.proxyGroups,
            latencyData: state.latencyData,
            isLoading: state.isFetchingGroups,
            isTestingLatency: state.isTestingLatency,
            onSelectProxy: selectProxy,
            onTestLatency: testAllDelays,
            onRefreshGroups: refreshProxyGroups
          }
        )
      }
    ),
    state.statusMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      StatusMessageContainer,
      {
        $isSuccess: state.isSuccess,
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { children: state.isSuccess ? "✓" : "✗" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusText, { children: state.statusMessage })
        ]
      }
    )
  ] }) });
};
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;
dt.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
  margin: 0;
`;
dt.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: ${(props) => props.theme.surfaceVariant};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => props.theme.textPrimary};
  transition: all ${(props) => props.theme.transition.fast} ease;
  
  &:hover {
    background: ${(props) => props.theme.border};
  }
`;
const WelcomeCard = dt(motion.div)`
  background: ${(props) => {
  if (props.$isGlassMode) {
    return "linear-gradient(135deg, rgba(30, 41, 59, 0.08) 0%, rgba(51, 65, 85, 0.05) 100%)";
  }
  return props.$isDarkMode ? "linear-gradient(135deg, #1e293b, #334155)" : "linear-gradient(135deg, #f8fafc, #e2e8f0)";
}};
  border-radius: 20px;
  padding: 1.8rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: ${(props) => {
  if (props.$isGlassMode) {
    return "1px solid rgba(148, 163, 184, 0.15)";
  }
  return `1px solid ${props.theme.border}`;
}};
  position: relative;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  align-items: center;
  backdrop-filter: ${(props) => props.$isGlassMode ? "blur(20px)" : "none"};
  box-shadow: ${(props) => {
  if (props.$isGlassMode) {
    return "0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)";
  }
  return "0 1px 2px rgba(0, 0, 0, 0.05)";
}};
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${(props) => {
  if (props.$isGlassMode) {
    return "radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, rgba(167, 139, 250, 0.05) 30%, transparent 60%)";
  }
  return props.$isDarkMode ? "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)" : "radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)";
}};
    animation: float 12s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => props.$isGlassMode ? "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)" : "none"};
    pointer-events: none;
    border-radius: 20px;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;
const WelcomeContent = dt.div`
  position: relative;
  z-index: 1;
  flex: 1;
`;
const WelcomeTitle = dt.h2`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.8rem 0;
  color: ${(props) => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: ${(props) => props.$isGlassMode ? "0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(96, 165, 250, 0.1)" : "none"};
  position: relative;
  z-index: 2;
`;
const WelcomeSubtitle = dt.p`
  font-size: 1rem;
  color: ${(props) => props.theme.textSecondary};
  margin: 0;
  line-height: 1.6;
  text-shadow: ${(props) => props.$isGlassMode ? "0 1px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 15px rgba(167, 139, 250, 0.08)" : "none"};
  position: relative;
  z-index: 2;
`;
dt(motion.div)`
  background: ${(props) => props.$isGlassMode ? "rgba(30, 41, 59, 0.08)" : props.theme.surface};
  border: ${(props) => props.$isGlassMode ? "1px solid rgba(148, 163, 184, 0.15)" : `1px solid ${props.theme.border}`};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: ${(props) => props.$isGlassMode ? "blur(16px)" : "none"};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
    pointer-events: none;
    border-radius: 12px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.$isGlassMode ? "0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)" : "0 8px 25px rgba(0, 0, 0, 0.1)"};
    background: ${(props) => props.$isGlassMode ? "rgba(51, 65, 85, 0.12)" : props.theme.surfaceVariant};
  }
`;
dt.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
`;
dt.div`
  flex: 1;
`;
dt.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.textPrimary};
  margin: 0 0 0.5rem 0;
`;
dt.p`
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;
const ContentSection = dt(motion.div)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
const ProxyPage = () => {
  const { isDarkMode, toggleTheme, themeMode } = useTheme();
  const [isProxyRunning, setIsProxyRunning] = reactExports.useState(false);
  const isGlassMode = themeMode.includes("Glass");
  reactExports.useEffect(() => {
    const checkStatus = async () => {
      try {
        if (window.electronAPI?.mihomo) {
          const status = await window.electronAPI.mihomo.status();
          setIsProxyRunning(status.isRunning);
        }
      } catch (error) {
        console.error("Error checking proxy status:", error);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5e3);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WelcomeCard,
      {
        $isDarkMode: isDarkMode,
        $isGlassMode: isGlassMode,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(WelcomeContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(WelcomeTitle, { $isGlassMode: isGlassMode, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 32 }),
            "代理管理中心"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WelcomeSubtitle, { $isGlassMode: isGlassMode, children: "配置和管理您的代理服务，享受安全、快速的网络体验" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ContentSection,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.2 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(RestructuredProxyManager, {})
      }
    )
  ] });
};
export {
  ProxyPage as default
};
