const { app, clipboard } = require('electron');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');
const logger = require('../utils/logger');
const { ConfigManager } = require('./config-manager');

/**
 * ConfigExportService
 * 汇总应用与 Clash 配置，按 JSON/YAML 序列化并输出到 文件/剪贴板/字符串
 */
class ConfigExportService {
  constructor(options = {}) {
    this.appDataPath =
      options.appDataPath || path.join(__dirname, '../../Appdata');
    this.configDir =
      options.configDir || path.join(this.appDataPath, 'config');
    this.configManager =
      options.configManager ||
      new ConfigManager({ appDataPath: this.appDataPath, configDir: this.configDir });
  }

  async getSourceData(scope) {
    const result = {};
    // app 配置
    if (scope?.app) {
      try {
        const appConfig = await this.configManager.loadAppConfig();
        result.app = appConfig || {};
      } catch (e) {
        logger.error('读取应用配置失败', { error: e.message });
        throw this._error('EXPORT_READ_ERROR', '读取应用配置失败');
      }
    }
    // clash 配置（基于当前 configManager 的 currentConfigPath 或默认路径）
    if (scope?.clash) {
      try {
        let clashConfigObj = {};
        let clashPath = this.configManager.getCurrentConfigPath();
        if (!clashPath) {
          // 尝试默认路径 Appdata/config/configs 下的任意 config.yaml
          const defaultConfigsDir = path.join(this.configDir, 'configs');
          if (fs.existsSync(defaultConfigsDir)) {
            const subdirs = await fsp.readdir(defaultConfigsDir, { withFileTypes: true });
            for (const d of subdirs) {
              if (d.isDirectory()) {
                const candidate = path.join(defaultConfigsDir, d.name, 'config.yaml');
                if (fs.existsSync(candidate)) {
                  clashPath = candidate;
                  break;
                }
              }
            }
          }
          // 兜底：shared/clash_config/config.json 或者其他已有默认
          if (!clashPath) {
            const sharedJson = path.join(__dirname, '../../../shared/clash_config/config.json');
            if (fs.existsSync(sharedJson)) {
              // 将 JSON 作为 clash 配置源
              const jsonText = await fsp.readFile(sharedJson, 'utf-8');
              clashConfigObj = JSON.parse(jsonText);
            }
          }
        }
        if (clashPath) {
          const text = await fsp.readFile(clashPath, 'utf-8');
          // clash 多为 YAML
          try {
            clashConfigObj = yaml.load(text) || {};
          } catch (yerr) {
            // 若解析失败，尝试 JSON
            clashConfigObj = JSON.parse(text);
          }
        }
        result.clash = clashConfigObj || {};
      } catch (e) {
        logger.error('读取 Clash 配置失败', { error: e.message });
        throw this._error('EXPORT_READ_ERROR', '读取 Clash 配置失败');
      }
    }
    return result;
  }

  serialize(data, format) {
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    if (format === 'yaml') {
      return yaml.dump(data);
    }
    throw this._error('INVALID_PARAM', '不支持的格式');
  }

  /**
   * 将内容写入文件。
   * 当 baseFilePath 为空时，默认写入用户下载目录。
   * 返回映射：{ json?: string, yaml?: string } 表示写入的绝对路径
   */
  async exportToFile(contentMap, baseFilePath) {
    const out = {};
    const userDownloads = app.getPath('downloads');
    if (contentMap.json) {
      const p =
        baseFilePath
          ? this._ensureExt(baseFilePath, '.json')
          : path.join(userDownloads, `app-config-export-${Date.now()}.json`);
      await fsp.writeFile(p, contentMap.json, 'utf-8');
      out.json = p;
    }
    if (contentMap.yaml) {
      const p =
        baseFilePath
          ? this._ensureExt(baseFilePath, '.yaml')
          : path.join(userDownloads, `clash-config-export-${Date.now()}.yaml`);
      await fsp.writeFile(p, contentMap.yaml, 'utf-8');
      out.yaml = p;
    }
    return out;
  }

  async exportToClipboard(contentMap) {
    // 若同时有两种格式，优先复制 YAML，备用 JSON 通过返回值提供
    if (contentMap.yaml) {
      clipboard.writeText(contentMap.yaml);
    } else if (contentMap.json) {
      clipboard.writeText(contentMap.json);
    }
  }

  exportToString(contentMap) {
    return {
      ...(contentMap.json ? { json: contentMap.json } : {}),
      ...(contentMap.yaml ? { yaml: contentMap.yaml } : {}),
    };
  }

  _ensureExt(p, ext) {
    if (p.toLowerCase().endsWith(ext)) return p;
    return p + ext;
  }

  _error(code, message) {
    const err = new Error(message);
    err.code = code;
    return err;
  }
}

module.exports = { ConfigExportService };