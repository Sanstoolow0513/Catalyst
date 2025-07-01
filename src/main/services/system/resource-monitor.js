const si = require('systeminformation');
const { EventEmitter } = require('events');

/**
 * 资源监控服务，用于监控CPU、内存和GPU的使用情况
 * @extends EventEmitter
 */
class ResourceMonitorService extends EventEmitter {
  /**
   * 创建资源监控服务实例
   * @param {Object} options 配置选项
   * @param {number} options.interval 监控间隔（毫秒）
   */
  constructor(options = {}) {
    super();
    this.interval = options.interval || 3000; // 默认3秒更新一次
    this.monitoring = false;
    this.timer = null;
    
    console.log('[ResourceMonitorService] 初始化完成');
  }

  /**
   * 开始监控系统资源
   */
  startMonitoring() {
    if (this.monitoring) {
      console.log('[ResourceMonitorService] 监控已在运行');
      return;
    }
    
    console.log(`[ResourceMonitorService] 开始监控资源，间隔: ${this.interval}ms`);
    this.monitoring = true;
    
    // 立即获取一次数据
    this.fetchData();
    
    // 设置定时获取
    this.timer = setInterval(() => {
      this.fetchData();
    }, this.interval);
  }

  /**
   * 停止监控系统资源
   */
  stopMonitoring() {
    if (!this.monitoring) {
      console.log('[ResourceMonitorService] 监控未在运行');
      return;
    }
    
    console.log('[ResourceMonitorService] 停止监控资源');
    
    clearInterval(this.timer);
    this.timer = null;
    this.monitoring = false;
  }

  /**
   * 获取当前系统资源使用情况
   * @private
   */
  async fetchData() {
    try {
      const [currentLoad, mem, gpuData] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        this.getGpuInfo()
      ]);
      
      const data = {
        cpu: {
          usage: currentLoad.currentLoad.toFixed(1),
          cores: currentLoad.cpus.map(core => ({
            load: core.load.toFixed(1)
          }))
        },
        memory: {
          used: mem.used,
          total: mem.total,
          usedPercent: ((mem.used / mem.total) * 100).toFixed(1)
        },
        gpu: gpuData
      };
      
      // 发出数据更新事件
      this.emit('data', data);
    } catch (error) {
      console.error(`[ResourceMonitorService] 获取资源数据失败: ${error.message}`);
      this.emit('error', error);
    }
  }

  /**
   * 获取GPU信息
   * @private
   * @returns {Promise<Object>} GPU信息
   */
  async getGpuInfo() {
    try {
      const graphics = await si.graphics();
      const gpus = graphics.controllers.map(gpu => ({
        model: gpu.model,
        memoryTotal: gpu.memoryTotal,
        usage: gpu.utilizationGpu || 0
      }));
      
      return {
        gpus,
        available: gpus.length > 0
      };
    } catch (error) {
      console.error(`[ResourceMonitorService] 获取GPU信息失败: ${error.message}`);
      return {
        gpus: [],
        available: false
      };
    }
  }

  /**
   * 设置监控间隔
   * @param {number} interval 监控间隔（毫秒）
   */
  setInterval(interval) {
    this.interval = interval;
    
    if (this.monitoring) {
      // 如果正在监控，重新启动以应用新间隔
      this.stopMonitoring();
      this.startMonitoring();
    }
  }

  /**
   * 获取当前是否正在监控
   * @returns {boolean} 是否正在监控
   */
  isMonitoring() {
    return this.monitoring;
  }
}

module.exports = { ResourceMonitorService }; 