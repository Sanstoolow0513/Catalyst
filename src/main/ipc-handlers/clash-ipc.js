const { ipcMain } = require('electron');
const logger = require('../utils/logger');
const { createError } = require('../utils/error-handler');

/**
 * 注册与Clash服务相关的IPC处理器
 * @param {Object} clashService Clash服务实例
 */
function registerClashIPCHandlers(clashService) {
  logger.info('开始注册Clash IPC处理器');

  // 启动Clash核心
  ipcMain.handle('start-clash', async (event) => {
    logger.info('收到启动Clash请求');
    try {
      if (!clashService) {
        logger.error('启动Clash失败：ClashService未初始化');
        throw createError('ClashService未初始化', 'IPC.start-clash');
      }
      await clashService.startMihomo();
      logger.info('Clash核心启动成功');
      return { success: true, message: 'Clash核心已启动' };
    } catch (error) {
      logger.error('启动Clash核心时发生错误', { error: error.message, stack: error.stack });
      return { success: false, message: error.message || '启动失败' };
    }
  });

  // 停止Clash核心
  ipcMain.handle('stop-clash', async (event) => {
    logger.info('收到停止Clash请求');
    try {
      if (!clashService) {
        logger.error('停止Clash失败：ClashService未初始化');
        throw createError('ClashService未初始化', 'IPC.stop-clash');
      }
      await clashService.stopMihomo();
      logger.info('Clash核心停止成功');
      return { success: true, message: 'Clash核心已停止' };
    } catch (error) {
      logger.error('停止Clash核心时发生错误', { error: error.message, stack: error.stack });
      return { success: false, message: error.message || '停止失败' };
    }
  });

  // 获取代理列表
  ipcMain.handle('get-proxy-list', async (event) => {
    logger.info('收到获取代理列表请求');
    try {
      if (!clashService) {
        logger.error('获取代理列表失败：ClashService未初始化');
        throw createError('ClashService未初始化', 'IPC.get-proxy-list');
      }
      const proxyList = await clashService.getProxyList();
      logger.info('代理列表获取成功', { count: proxyList.length });
      return { success: true, data: proxyList };
    } catch (error) {
      logger.error('获取代理列表时发生错误', { error: error.message, stack: error.stack });
      return { success: false, message: error.message || '获取失败' };
    }
  });

  // 切换代理
  ipcMain.handle('switch-proxy', async (event, groupName, proxyName) => {
    logger.info('收到切换代理请求', { groupName, proxyName });
    try {
      if (!clashService) {
        logger.error('切换代理失败：ClashService未初始化');
        throw createError('ClashService未初始化', 'IPC.switch-proxy');
      }
      const success = await clashService.switchProxy(groupName, proxyName);
      if (success) {
        logger.info('代理切换成功', { groupName, proxyName });
        return { success: true, message: '代理切换成功' };
      } else {
        logger.warn('代理切换失败', { groupName, proxyName });
        return { success: false, message: '代理切换失败' };
      }
    } catch (error) {
      logger.error('切换代理时发生错误', { groupName, proxyName, error: error.message, stack: error.stack });
      return { success: false, message: error.message || '切换失败' };
    }
  });

  // 测试代理延迟
  ipcMain.handle('test-proxy-latency', async (event, proxyName) => {
    logger.info('收到测试代理延迟请求', { proxyName });
    try {
      if (!clashService) {
        logger.error('测试代理延迟失败：ClashService未初始化');
        throw createError('ClashService未初始化', 'IPC.test-proxy-latency');
      }
      const latency = await clashService.testProxyLatency(proxyName);
      if (latency >= 0) {
        logger.info('代理延迟测试成功', { proxyName, latency });
        return { success: true, data: latency };
      } else {
        logger.warn('代理延迟测试失败', { proxyName });
        return { success: false, message: '测试失败' };
      }
    } catch (error) {
      logger.error('测试代理延迟时发生错误', { proxyName, error: error.message, stack: error.stack });
      return { success: false, message: error.message || '测试失败' };
    }
  });

  // 设置系统代理
  ipcMain.handle('set-system-proxy', async (event) => {
    logger.info('收到设置系统代理请求');
    try {
      if (!clashService) {
        logger.error('设置系统代理失败：ClashService未初始化');
        throw createError('ClashService未初始化', 'IPC.set-system-proxy');
      }
      const success = await clashService.setSystemProxy();
      if (success) {
        logger.info('系统代理设置成功');
        return { success: true, message: '系统代理已设置' };
      } else {
        logger.warn('系统代理设置失败');
        return { success: false, message: '设置失败' };
      }
    } catch (error) {
      logger.error('设置系统代理时发生错误', { error: error.message, stack: error.stack });
      return { success: false, message: error.message || '设置失败' };
    }
  });

  // 清除系统代理
  ipcMain.handle('clear-system-proxy', async (event) => {
    logger.info('收到清除系统代理请求');
    try {
      if (!clashService) {
        logger.error('清除系统代理失败：ClashService未初始化');
        throw createError('ClashService未初始化', 'IPC.clear-system-proxy');
      }
      const success = await clashService.clearSystemProxy();
      if (success) {
        logger.info('系统代理清除成功');
        return { success: true, message: '系统代理已清除' };
      } else {
        logger.warn('系统代理清除失败');
        return { success: false, message: '清除失败' };
      }
    } catch (error) {
      logger.error('清除系统代理时发生错误', { error: error.message, stack: error.stack });
      return { success: false, message: error.message || '清除失败' };
    }
  });

  // 新增：请求代理列表事件
  ipcMain.on('request-proxy-list', async (event) => {
    try {
      const proxyList = await clashService.getProxyList();
      event.sender.send('proxy-list-update', proxyList);
    } catch (error) {
      logger.error('发送代理列表失败', { error: error.message });
    }
  });

  logger.info('Clash IPC处理器注册完成');
}

module.exports = { registerClashIPCHandlers };