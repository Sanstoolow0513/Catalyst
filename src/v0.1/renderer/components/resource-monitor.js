const { ipcRenderer } = require('electron');

/**
 * 资源监控组件类
 */
class ResourceMonitor {
  /**
   * 创建资源监控组件
   * @param {Object} options - 组件选项
   * @param {string} options.cpuProgressId - CPU进度条元素ID
   * @param {string} options.memProgressId - 内存进度条元素ID
   * @param {string} options.gpuProgressId - GPU进度条元素ID
   */
  constructor(options) {
    this.cpuProgress = document.getElementById(options.cpuProgressId);
    this.memProgress = document.getElementById(options.memProgressId);
    this.gpuProgress = document.getElementById(options.gpuProgressId);
    this.monitoring = false;
    this.interval = null;
    this.updateInterval = 3000; // 默认更新频率为3秒

    // 验证元素是否存在
    if (!this.cpuProgress) console.error('[ResourceMonitor] 找不到CPU进度条元素');
    if (!this.memProgress) console.error('[ResourceMonitor] 找不到内存进度条元素');
    if (!this.gpuProgress) console.error('[ResourceMonitor] 找不到GPU进度条元素');
  }

  /**
   * 初始化组件
   */
  initialize() {
    console.log('[ResourceMonitor] 初始化资源监控组件');
    this.setupEventListeners();
    this.startMonitoring();
  }

  /**
   * 设置事件监听器
   * @private
   */
  setupEventListeners() {
    // 监听资源数据更新
    ipcRenderer.on('resource-monitor-data', (event, data) => {
      this.updateDisplay(data);
    });

    // 监听资源监控错误
    ipcRenderer.on('resource-monitor-error', (event, error) => {
      console.error('[ResourceMonitor] 资源监控错误:', error);
    });

    // 标签页切换监听器，只有当资源监控标签可见时才发送请求
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.tab === 'resource-monitor') {
          if (!this.monitoring) {
            this.startMonitoring();
          }
        } else {
          if (this.monitoring) {
            this.stopMonitoring();
          }
        }
      });
    });
  }

  /**
   * 开始监控系统资源
   */
  startMonitoring() {
    if (this.monitoring) return;
    
    console.log('[ResourceMonitor] 开始监控系统资源');
    this.monitoring = true;
    
    // 立即请求一次数据
    this.requestData();
    
    // 设置定时请求
    this.interval = setInterval(() => {
      this.requestData();
    }, this.updateInterval);
    
    // 告诉主进程开始监控
    ipcRenderer.send('start-resource-monitor', { interval: this.updateInterval });
  }

  /**
   * 停止监控系统资源
   */
  stopMonitoring() {
    if (!this.monitoring) return;
    
    console.log('[ResourceMonitor] 停止监控系统资源');
    this.monitoring = false;
    
    clearInterval(this.interval);
    this.interval = null;
    
    // 告诉主进程停止监控
    ipcRenderer.send('stop-resource-monitor');
  }

  /**
   * 请求资源数据
   * @private
   */
  requestData() {
    ipcRenderer.send('get-resource-data');
  }

  /**
   * 更新显示资源使用情况
   * @param {Object} data - 资源数据
   * @private
   */
  updateDisplay(data) {
    if (!data) return;

    // 更新CPU使用率
    if (data.cpu && this.cpuProgress) {
      const cpuUsage = data.cpu.usage;
      this.cpuProgress.style.width = `${cpuUsage}%`;
      this.cpuProgress.textContent = `${cpuUsage}%`;
      
      // 根据使用率改变颜色
      this.updateProgressColor(this.cpuProgress, cpuUsage);
    }

    // 更新内存使用率
    if (data.memory && this.memProgress) {
      const memUsage = data.memory.usedPercent;
      this.memProgress.style.width = `${memUsage}%`;
      this.memProgress.textContent = `${memUsage}%`;
      
      // 根据使用率改变颜色
      this.updateProgressColor(this.memProgress, memUsage);
    }

    // 更新GPU使用率
    if (data.gpu && this.gpuProgress) {
      let gpuUsage = 0;
      
      if (data.gpu.available && data.gpu.gpus.length > 0) {
        // 如果有多个GPU，取平均值
        const totalUsage = data.gpu.gpus.reduce((acc, gpu) => acc + gpu.usage, 0);
        gpuUsage = totalUsage / data.gpu.gpus.length;
      }
      
      this.gpuProgress.style.width = `${gpuUsage}%`;
      this.gpuProgress.textContent = `${gpuUsage.toFixed(1)}%`;
      
      // 根据使用率改变颜色
      this.updateProgressColor(this.gpuProgress, gpuUsage);
    }
  }

  /**
   * 根据使用率更新进度条颜色
   * @param {HTMLElement} progressBar - 进度条元素
   * @param {number} usage - 使用率
   * @private
   */
  updateProgressColor(progressBar, usage) {
    // 移除所有可能的类
    progressBar.classList.remove('low', 'medium', 'high', 'critical');
    
    // 添加对应的类
    if (usage < 30) {
      progressBar.classList.add('low');
    } else if (usage < 60) {
      progressBar.classList.add('medium');
    } else if (usage < 85) {
      progressBar.classList.add('high');
    } else {
      progressBar.classList.add('critical');
    }
  }

  /**
   * 设置更新间隔
   * @param {number} ms - 更新间隔（毫秒）
   */
  setUpdateInterval(ms) {
    this.updateInterval = ms;
    
    // 如果正在监控，重新启动以应用新间隔
    if (this.monitoring) {
      this.stopMonitoring();
      this.startMonitoring();
    }
  }
}

module.exports = { ResourceMonitor }; 