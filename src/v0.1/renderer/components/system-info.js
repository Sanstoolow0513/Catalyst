const { ipcRenderer } = require('electron');

/**
 * 系统信息组件类
 */
class SystemInfo {
  /**
   * 创建系统信息组件
   * @param {Object} options - 组件选项
   * @param {string} options.containerId - 容器元素ID
   */
  constructor(options) {
    this.container = document.getElementById(options.containerId);
    
    if (!this.container) {
      console.error('[SystemInfo] 找不到系统信息容器元素');
    }
  }

  /**
   * 初始化组件
   */
  initialize() {
    console.log('[SystemInfo] 初始化系统信息组件');
    this.setupEventListeners();
    this.requestSystemInfo();
  }

  /**
   * 设置事件监听器
   * @private
   */
  setupEventListeners() {
    // 监听系统信息响应
    ipcRenderer.on('system-info-data', (event, data) => {
      this.displaySystemInfo(data);
    });

    // 监听系统信息错误
    ipcRenderer.on('system-info-error', (event, error) => {
      console.error('[SystemInfo] 获取系统信息失败:', error);
      if (this.container) {
        this.container.innerHTML = `<p style="color: var(--accent-error);">获取系统信息失败: ${error}</p>`;
      }
    });
  }

  /**
   * 请求系统信息数据
   * @private
   */
  requestSystemInfo() {
    console.log('[SystemInfo] 请求系统信息数据');
    ipcRenderer.send('get-system-info');

    // 显示加载指示器
    if (this.container) {
      this.container.innerHTML = '<div class="loading">正在加载系统信息...</div>';
    }
  }

  /**
   * 显示系统信息
   * @param {Object} data - 系统信息数据
   * @private
   */
  displaySystemInfo(data) {
    console.log('[SystemInfo] 收到系统信息数据:', data);
    
    if (!this.container) return;

    // 清除容器内容
    this.container.innerHTML = '';

    // 格式化字节函数
    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // 创建并添加信息项目
    const infoItems = {
      '操作系统': `${data.osInfo.distro} ${data.osInfo.release} (${data.osInfo.arch})`,
      '内核版本': data.osInfo.kernel,
      '主板': `${data.baseboard.manufacturer} ${data.baseboard.model}`,
      'CPU': `${data.cpu.manufacturer} ${data.cpu.brand} @ ${data.cpu.speed}GHz`,
      '逻辑核心数': data.cpu.cores,
      '物理核心数': data.cpu.physicalCores,
      '总内存': formatBytes(data.mem.total),
    };

    // 添加基本信息
    for (const [key, value] of Object.entries(infoItems)) {
      const item = document.createElement('div');
      item.className = 'info-item';
      item.innerHTML = `<span class="info-label">${key}:</span> <span>${value}</span>`;
      this.container.appendChild(item);
    }

    // 添加磁盘信息
    data.diskLayout.forEach((disk, index) => {
      const item = document.createElement('div');
      item.className = 'info-item';
      item.innerHTML = `<span class="info-label">磁盘 ${index + 1}:</span> <span>${disk.name} (${formatBytes(disk.size)})</span>`;
      this.container.appendChild(item);
    });
  }

  /**
   * 刷新系统信息
   */
  refresh() {
    this.requestSystemInfo();
  }
}

module.exports = { SystemInfo }; 