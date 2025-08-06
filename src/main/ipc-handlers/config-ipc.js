const { ipcMain } = require('electron');
const logger = require('../utils/logger');
const { ConfigExportService } = require('../services/config-export');
const { ipcErrorMiddleware } = require('../utils/ipc-middleware');

/**
 * 注册配置导出相关 IPC
 * channel: 'config-export:request-export'
 * payload:
 *  {
 *    format: "json" | "yaml" | "both",
 *    scope: { clash: boolean, app: boolean },
 *    target: { type: "file" | "clipboard" | "string", filePath?: string }
 *  }
 */
function registerConfigExportIPCHandlers(mainWindow) {
  const service = new ConfigExportService();

  ipcMain.handle(
    'config-export:request-export',
    ipcErrorMiddleware(async (event, payload) => {
      const { format, scope, target } = payload || {};
      // 参数校验
      if (!format || !['json', 'yaml', 'both'].includes(format)) {
        logger.warn('配置导出 - 无效的 format', { format });
        return { status: 'error', code: 'INVALID_PARAM', message: 'format 参数无效' };
      }
      if (!scope || (scope.app !== true && scope.clash !== true)) {
        logger.warn('配置导出 - 无效的 scope', { scope });
        return { status: 'error', code: 'INVALID_PARAM', message: 'scope 至少选择一个导出项' };
      }
      if (!target || !['file', 'clipboard', 'string'].includes(target.type)) {
        logger.warn('配置导出 - 无效的 target', { target });
        return { status: 'error', code: 'INVALID_PARAM', message: 'target 参数无效' };
      }

      try {
        // 收集源数据
        const data = await service.getSourceData(scope);

        // 生成导出内容
        const contentMap = {};
        if (format === 'json' || format === 'both') {
          contentMap.json = service.serialize(data, 'json');
        }
        if (format === 'yaml' || format === 'both') {
          contentMap.yaml = service.serialize(data, 'yaml');
        }

        // 目标输出
        if (target.type === 'file') {
          const files = await service.exportToFile(contentMap, target.filePath);
          logger.info('配置导出至文件成功', files);
          return { status: 'ok', files };
        }
        if (target.type === 'clipboard') {
          await service.exportToClipboard(contentMap);
          logger.info('配置已复制到剪贴板');
          return { status: 'ok', content: service.exportToString(contentMap) };
        }
        // string
        const content = service.exportToString(contentMap);
        logger.info('配置导出为字符串成功');
        return { status: 'ok', content };
      } catch (err) {
        logger.error('配置导出失败', { error: err.message, code: err.code, stack: err.stack });
        return {
          status: 'error',
          code: err.code || 'UNKNOWN',
          message: err.message || '配置导出失败',
        };
      }
    })
  );
}

module.exports = { registerConfigExportIPCHandlers };