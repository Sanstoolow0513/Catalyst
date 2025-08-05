/**
 * IPC事件常量定义
 * 遵循命名规范：[模块名]_[操作]_[方向]
 * 方向: REQ(请求), RES(响应), PUB(发布)
 */
export const CLASH_EVENTS = {
  // 核心控制
  START_REQ: 'clash:start',
  START_RES: 'clash:start:response',
  STOP_REQ: 'clash:stop',
  STOP_RES: 'clash:stop:response',
  
  // 代理管理
  GET_PROXY_LIST_REQ: 'clash:get-proxy-list',
  GET_PROXY_LIST_RES: 'clash:get-proxy-list:response',
  SWITCH_PROXY_REQ: 'clash:switch-proxy',
  SWITCH_PROXY_RES: 'clash:switch-proxy:response',
  TEST_PROXY_LATENCY_REQ: 'clash:test-proxy-latency',
  TEST_PROXY_LATENCY_RES: 'clash:test-proxy-latency:response',
  
  // 系统代理
  SET_SYSTEM_PROXY_REQ: 'clash:set-system-proxy',
  SET_SYSTEM_PROXY_RES: 'clash:set-system-proxy:response',
  CLEAR_SYSTEM_PROXY_REQ: 'clash:clear-system-proxy',
  CLEAR_SYSTEM_PROXY_RES: 'clash:clear-system-proxy:response',
  
  // 数据更新
  PROXY_LIST_UPDATE_PUB: 'clash:proxy-list-update'
};

export const AUTH_EVENTS = {
  LOGIN_REQ: 'auth:login:request',
  LOGIN_RES: 'auth:login:response'
};

export const CONFIG_EVENTS = {
  UPLOAD_REQ: 'config:upload:request',
  UPLOAD_RES: 'config:upload:response',
  DOWNLOAD_REQ: 'config:download:request',
  DOWNLOAD_RES: 'config:download:response'
};

export const LLM_EVENTS = {
  SET_API_KEY_REQ: 'llm:set-api-key',
  SET_API_KEY_RES: 'llm:set-api-key:response',
  SEND_MESSAGE_REQ: 'llm:send-message',
  SEND_MESSAGE_RES: 'llm:send-message:response',
  STATUS_UPDATE_PUB: 'llm:status-update'
};