const axios = require('axios');

/**
 * 创建一个配置化的 HTTP 客户端实例
 * @param {Object} options 配置选项
 * @param {number} options.timeout 请求超时时间（毫秒）
 * @param {Object} options.headers 默认请求头
 * @param {Function} options.onRequest 请求拦截器
 * @param {Function} options.onResponse 响应拦截器
 * @param {Function} options.onError 错误拦截器
 * @returns {Object} axios 实例
 */
function createHttpClient(options = {}) {
  const {
    timeout = 10000,
    headers = {},
    onRequest = null,
    onResponse = null,
    onError = null
  } = options;

  const client = axios.create({
    timeout,
    headers: {
      'User-Agent': 'Catalyst/1.0.0',
      ...headers
    }
  });

  // 请求拦截器
  if (onRequest) {
    client.interceptors.request.use(onRequest);
  }

  // 响应拦截器
  if (onResponse) {
    client.interceptors.response.use(onResponse);
  }

  // 错误拦截器
  if (onError) {
    client.interceptors.response.use(null, onError);
  }

  return client;
}

module.exports = { createHttpClient };