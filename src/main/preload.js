const { contextBridge, ipcRenderer } = require('electron');

// 将一组安全的IPC函数暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * 发送异步请求并等待响应
   * @param {string} channel - IPC通道
   * @param  {...any} args - 参数
   * @returns {Promise<any>} - 主进程返回的结果
   */
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),

  /**
   * 发送单向消息到主进程
   * @param {string} channel - IPC通道
   * @param {any} data - 数据
   */
  send: (channel, data) => ipcRenderer.send(channel, data),

  /**
   * 监听来自主进程的事件
   * @param {string} channel - IPC通道
   * @param {Function} func - 回调函数
   * @returns {Function} - 用于取消监听的函数
   */
  on: (channel, func) => {
    const subscription = (event, ...args) => func(...args);
    ipcRenderer.on(channel, subscription);
    
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  /**
   * 移除指定通道的所有监听器
   * @param {string} channel - IPC通道
   */
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

console.log('Preload script executed and electronAPI exposed.');