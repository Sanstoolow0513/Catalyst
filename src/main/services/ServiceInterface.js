/**
 * 服务层接口定义
 * 所有服务类必须实现这些方法
 */
class ServiceInterface {
  /**
   * 初始化服务
   * @returns {Promise<boolean>} 初始化是否成功
   */
  async init() {
    throw new Error('未实现init方法');
  }

  /**
   * 销毁服务
   * @returns {Promise<boolean>} 销毁是否成功
   */
  async destroy() {
    throw new Error('未实现destroy方法');
  }
}

module.exports = ServiceInterface;