const si = require('systeminformation');

/**
 * 系统信息服务，用于获取系统硬件和软件信息
 */
class SystemInfoService {
  /**
   * 创建系统信息服务实例
   */
  constructor() {
    console.log('[SystemInfoService] 初始化完成');
  }

  /**
   * 获取完整的系统信息
   * @returns {Promise<Object>} 系统信息
   */
  async getFullSystemInfo() {
    try {
      const [cpu, baseboard, mem, osInfo, diskLayout] = await Promise.all([
        si.cpu(),
        si.baseboard(),
        si.mem(),
        si.osInfo(),
        si.diskLayout(),
      ]);

      return {
        cpu,
        baseboard,
        mem,
        osInfo,
        diskLayout,
      };
    } catch (error) {
      console.error(`[SystemInfoService] 获取系统信息失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取CPU信息
   * @returns {Promise<Object>} CPU信息
   */
  async getCpuInfo() {
    try {
      return await si.cpu();
    } catch (error) {
      console.error(`[SystemInfoService] 获取CPU信息失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取内存信息
   * @returns {Promise<Object>} 内存信息
   */
  async getMemoryInfo() {
    try {
      return await si.mem();
    } catch (error) {
      console.error(`[SystemInfoService] 获取内存信息失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取操作系统信息
   * @returns {Promise<Object>} 操作系统信息
   */
  async getOsInfo() {
    try {
      return await si.osInfo();
    } catch (error) {
      console.error(`[SystemInfoService] 获取操作系统信息失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取磁盘信息
   * @returns {Promise<Array>} 磁盘信息
   */
  async getDiskInfo() {
    try {
      return await si.diskLayout();
    } catch (error) {
      console.error(`[SystemInfoService] 获取磁盘信息失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取主板信息
   * @returns {Promise<Object>} 主板信息
   */
  async getMotherboardInfo() {
    try {
      return await si.baseboard();
    } catch (error) {
      console.error(`[SystemInfoService] 获取主板信息失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 格式化字节大小为可读格式
   * @param {number} bytes - 字节大小
   * @returns {string} 格式化后的大小
   */
  static formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

module.exports = { SystemInfoService }; 