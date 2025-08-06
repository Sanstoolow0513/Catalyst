const { ipcMain } = require('electron');
const LLMService = require('../services/llm/llm-service');
const logger = require('../utils/logger');
const { ipcErrorMiddleware } = require('../utils/ipc-middleware');
const { LLM_EVENTS } = require('../../shared/ipc-events');

const llmService = new LLMService();

function registerLLMIPCHandlers(mainWindow) {
  logger.info('注册LLM IPC处理器');

  // 设置API密钥
  ipcMain.handle(
    LLM_EVENTS.SET_API_KEY_REQ,
    ipcErrorMiddleware(async (event, apiKey) => {
      const success = await llmService.setApiKey(apiKey);
      if (!success) throw new Error('API密钥设置失败');
      logger.info('API密钥设置成功');
      return { ok: true };
    })
  );

  // 发送消息
  ipcMain.handle(
    LLM_EVENTS.SEND_MESSAGE_REQ,
    ipcErrorMiddleware(async (event, message) => {
      const response = await llmService.sendMessage(message);
      logger.info('LLM消息发送成功');
      return { response };
    })
  );

  // 状态更新通知（发布型事件）
  ipcMain.on(LLM_EVENTS.STATUS_UPDATE_PUB, (event, status) => {
    mainWindow.webContents.send(LLM_EVENTS.STATUS_UPDATE_PUB, status);
  });
}

module.exports = { registerLLMIPCHandlers };