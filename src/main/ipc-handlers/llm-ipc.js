const { ipcMain } = require('electron');
const LLMService = require('../services/llm/llm-service');
const logger = require('../../utils/logger');
const { LLM_EVENTS } = require('../../../shared/ipc-events');

const llmService = new LLMService();

function registerLLMIPCHandlers(mainWindow) {
  logger.info('注册LLM IPC处理器');

  // 设置API密钥
  ipcMain.handle(LLM_EVENTS.SET_API_KEY_REQ, async (event, apiKey) => {
    try {
      const success = await llmService.setApiKey(apiKey);
      if (success) {
        logger.info('API密钥设置成功');
        return { success: true };
      }
      return { success: false, message: 'API密钥设置失败' };
    } catch (error) {
      logger.error('设置API密钥时出错', error);
      return { success: false, message: error.message };
    }
  });

  // 发送消息
  ipcMain.handle(LLM_EVENTS.SEND_MESSAGE_REQ, async (event, message) => {
    try {
      const response = await llmService.sendMessage(message);
      logger.info('LLM消息发送成功');
      return { success: true, response };
    } catch (error) {
      logger.error('发送LLM消息时出错', error);
      return { success: false, message: error.message };
    }
  });

  // 状态更新通知
  ipcMain.on(LLM_EVENTS.STATUS_UPDATE_PUB, (event, status) => {
    mainWindow.webContents.send(LLM_EVENTS.STATUS_UPDATE_PUB, status);
  });
}

module.exports = { registerLLMIPCHandlers };