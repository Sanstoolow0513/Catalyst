const path = require('path');
const axios = require('axios');
const yaml = require('js-yaml');
const AdmZip = require('adm-zip');
const zlib = require('zlib');
const fs = require('fs');
const { readFile, writeFile, access } = require('fs/promises');
const { spawn } = require('child_process');
const { ProxyManager } = require('./proxy-manager');
const { ConfigManager } = require('./config-manager');

/**
 * Clash 管理服务，负责核心下载、配置管理、进程控制和系统代理设置
 * 提供节点选择、延迟测试和代理切换功能
 */
class ClashService {
  /**
   * 创建 Clash 服务实例
   * @param {Object} options 配置选项
   * @param {string} options.configBaseDir 配置基础目录
   * @param {string} options.clashCorePath Clash 核心路径
   * @param {string} options.PROXY_SERVER 代理服务器地址
   * @param {string} options.PROXY_OVERRIDE 代理例外列表
   */
  constructor(options = {}, mainWindow) {
    this.mainWindow = mainWindow; // 保存主窗口引用
    this.configBaseDir = options.configBaseDir;
    this.clashCorePath = options.clashCorePath;
    this.currentConfigPath = null;
    this.PROXY_SERVER = options.PROXY_SERVER;
    this.PROXY_OVERRIDE = options.PROXY_OVERRIDE;
    this.clashProcess = null;
    this.clashConfig = null;
    this.externalController = null;
    
    // 创建子模块
    this.proxyManager = new ProxyManager(options);
    this.configManager = new ConfigManager(options);

    console.log('[ClashService] 初始化完成');
  }

  /**
   * 解压 .gz 文件到指定路径
   * @param {string} gzFilePath - .gz 文件路径
   * @param {string} outputFilePath - 解压后的文件路径
   * @returns {Promise<void>}
   */
  async decompressGzFile(gzFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
      const input = fs.createReadStream(gzFilePath);
      const output = fs.createWriteStream(outputFilePath);
      const gunzip = zlib.createGunzip();

      input.pipe(gunzip).pipe(output);

      output.on('finish', () => {
        console.log(`[ClashService] 文件已成功解压到 ${outputFilePath}`);
        resolve();
      });

      output.on('error', (error) => {
        console.error(`[ClashService] 解压文件时发生错误: ${error.message}`);
        reject(error);
      });
    });
  }

  /**
   * 初始化服务：检查核心，下载配置
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      console.log(`[ClashService] 初始化开始`);
      console.log(`[ClashService] 配置基础目录: ${this.configBaseDir}`);
      console.log(`[ClashService] Clash 核心路径: ${this.clashCorePath}`);

      await this.checkAndDownloadCore();
      await this.ensureConfigIsLoaded();
    } catch (error) {
      console.error(`[ClashService] 初始化失败: ${error.message}`);
      if (this.mainWindow) {
        this.mainWindow.webContents.send('clash-service-error', error.message);
      }
      throw error; // 仍然向上抛出，以便调用者知道失败了
    }
  }

  /**
   * 确保配置文件已下载并加载到内存
   */
  async ensureConfigIsLoaded() {
    // 如果配置已在内存中，则无需操作
    if (this.clashConfig) {
      return;
    }

    console.log('[ClashService] 配置文件未加载，正在尝试获取...');
    // 调用配置管理器下载或找到本地配置
    await this.configManager.downloadConfigFromUrl();
    this.currentConfigPath = this.configManager.getCurrentConfigPath();
    
    // 如果找到了配置文件路径，则加载它
    if (this.currentConfigPath) {
      await this.loadConfig(this.currentConfigPath);
    }

    // 如果执行完上述操作后，配置仍未加载，则抛出错误
    if (!this.clashConfig) {
      throw new Error('无法加载或找到有效的配置文件。');
    }
    console.log('[ClashService] 配置文件加载成功。');
  }

  /**
   * 检查并下载 Mihomo 核心
   */
  async checkAndDownloadCore() {
    console.log('[ClashService] 检查 Mihomo 核心是否存在...');
    try {
      await access(this.clashCorePath);
      console.log('[ClashService] 已找到 Mihomo 核心，跳过下载。');
    } catch (error) {
      console.log('[ClashService] 未找到 Mihomo 核心，正在尝试下载...');
      try {
        await this.downloadMihomoCore(this.clashCorePath);
      } catch (downloadError) {
        console.error(
          `[ClashService] 下载 Mihomo 核心失败: ${downloadError.message}`
        );
        throw new Error('Mihomo 核心下载失败');
      }
    }
  }

  /**
   * 下载 Mihomo 核心
   * @param {string} targetPath - 核心保存路径
   * @returns {Promise<void>}
   */
  async downloadMihomoCore(targetPath) {
    const version = 'v1.19.10';
    const zipFilePath = path.join(path.dirname(targetPath), 'mihomo.zip');

    let downloadUrl = `https://github.com/MetaCubeX/mihomo/releases/download/${version}/mihomo-windows-amd64-${version}.zip`;
    console.log(`[ClashService] 正在从 ${downloadUrl} 下载 mihomo 核心...`);
    try {
      const response = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
      });
      await writeFile(zipFilePath, Buffer.from(response.data));
      console.log(`[ClashService] mihomo 核心已成功下载到 ${zipFilePath}`);
      console.log('[ClashService] 正在解压 mihomo 核心...');
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(path.dirname(targetPath), true);
      console.log(`[ClashService] mihomo 核心已成功解压到 ${targetPath}`);
    } catch (error) {
      console.error(`[ClashService] 下载 mihomo 核心时发生错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 加载并解析配置文件
   * @param {string} configPath - 配置文件路径
   * @returns {Promise<object>} 解析后的配置对象
   */
  async loadConfig(configPath) {
    try {
      const configContent = await readFile(configPath, 'utf-8');
      this.clashConfig = yaml.load(configContent);
      this.externalController = this.clashConfig['external-controller'];
      console.log(`[ClashService] 配置文件加载成功: ${configPath}`);
      console.log(`[ClashService] 外部控制器: ${this.externalController}`);
      return this.clashConfig;
    } catch (error) {
      console.error(`[ClashService] 加载或解析配置文件时发生错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 启动 Mihomo 进程
   * @returns {Promise<void>}
   */
  async startMihomo() {
    if (!this.currentConfigPath) {
      console.error('[ClashService] 未指定配置文件路径，无法启动 Mihomo');
      throw new Error('未指定配置文件路径');
    }
    if (!this.clashCorePath) {
       console.error('[ClashService] 未指定 Mihomo 核心路径，无法启动 Mihomo');
       throw new Error('未指定 Mihomo 核心路径');
    }
    if (this.clashProcess) {
        console.log('[ClashService] Mihomo 进程已在运行');
        return;
    }

    console.log('[ClashService] 启动 Mihomo 服务...');
    try {
      this.clashProcess = spawn(this.clashCorePath, [
        '-d',
        path.dirname(this.currentConfigPath),
      ]);
      console.log(`[ClashService] Mihomo 进程ID: ${this.clashProcess.pid}`);

      this.clashProcess.stdout.on('data', (data) => {
        console.log(`[mihomo]: ${data.toString().trim()}`);
      });

      this.clashProcess.stderr.on('data', (data) => {
        console.error(`[mihomo error]: ${data.toString().trim()}`);
      });

      this.clashProcess.on('close', (code) => {
        console.log(`[ClashService] Mihomo 进程退出，退出码: ${code}`);
        this.clashProcess = null; // 进程退出时清空引用
      });

      this.clashProcess.on('error', (error) => {
          console.error(`[ClashService] 启动 Mihomo 进程失败: ${error.message}`);
          this.clashProcess = null;
      });

      // 等待Clash启动
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('[ClashService] Mihomo 服务已启动');

    } catch (error) {
      console.error(`[ClashService] 启动 Mihomo 进程时发生错误: ${error.message}`);
      throw error;
    }
  }

  /**
   * 停止 Mihomo 进程
   * @returns {Promise<void>}
   */
  async stopMihomo() {
    if (!this.clashProcess) {
      console.log('[ClashService] Mihomo 进程未运行，无需停止');
      return;
    }

    console.log('[ClashService] 正在停止 Mihomo 进程...');
    try {
      // 在Windows中，SIGTERM可能不被正确处理，先尝试SIGTERM，然后使用kill
      this.clashProcess.kill('SIGTERM');
      
      // 等待一段时间检查进程是否退出
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (this.clashProcess && !this.clashProcess.killed) {
        console.log('[ClashService] 进程未响应SIGTERM，尝试强制终止...');
        this.clashProcess.kill('SIGKILL');
      }
      
      console.log('[ClashService] Mihomo 进程已停止');
    } catch (error) {
      console.error(`[ClashService] 停止 Mihomo 进程时发生错误: ${error.message}`);
      throw error;
    } finally {
      // 无论成功或失败，都清空进程引用
      this.clashProcess = null;
    }
  }

  /**
   * 清除系统代理设置
   * @returns {Promise<boolean>}
   */
  async clearSystemProxy() {
    return await this.proxyManager.clearSystemProxy();
  }

  /**
   * 设置系统代理
   * @returns {Promise<boolean>}
   */
  async setSystemProxy() {
    return await this.proxyManager.setSystemProxy(this.PROXY_SERVER, this.PROXY_OVERRIDE);
  }

  /**
   * 获取代理组列表（从已加载的配置文件中）
   * @returns {Promise<Array>} 代理组列表
   */
  async getProxyList() {
    // 确保配置已加载
    await this.ensureConfigIsLoaded();
    
    const proxyGroups = this.clashConfig['proxy-groups'];
    if (!proxyGroups || !Array.isArray(proxyGroups)) {
      console.log('[ClashService] 配置文件中未找到有效的 "proxy-groups"');
      return [];
    }

    // 从配置文件解析代理组
    const result = proxyGroups
      .filter(group => group.type === 'select' || group.type === 'selector')
      .map(group => ({
        name: group.name,
        type: group.type,
        // 默认显示第一个节点作为当前节点
        current: group.proxies ? group.proxies[0] || '' : '', 
        options: group.proxies || [],
      }));
    
    // 如果Clash正在运行，则尝试用API获取实时"当前选择"来更新列表
    if (this.clashProcess && this.externalController) {
      try {
        console.log('[ClashService] Clash正在运行，尝试从API获取实时节点信息...');
        const url = `http://${this.externalController}/proxies`;
        const response = await axios.get(url, { timeout: 2000 });
        const liveProxies = response.data.proxies;
        
        for (const group of result) {
          if (liveProxies[group.name] && liveProxies[group.name].now) {
            group.current = liveProxies[group.name].now;
          }
        }
        console.log('[ClashService] 已成功更新实时节点信息。');
      } catch (e) {
        console.warn(`[ClashService] 无法从API获取实时节点信息: ${e.message}`);
      }
    }

    return result;
  }

  /**
   * 测试代理延迟
   * @param {string} proxyName - 代理名称
   * @returns {Promise<number>} 延迟(毫秒)
   */
  async testProxyLatency(proxyName) {
    if (!this.externalController) {
      throw new Error('未配置外部控制器地址');
    }

    try {
      const url = `http://${this.externalController}/proxies/${encodeURIComponent(proxyName)}/delay`;
      const params = { timeout: 5000, url: 'http://www.gstatic.com/generate_204' };
      const response = await axios.get(url, { params });
      return response.data.delay; // 返回延迟(毫秒)
    } catch (error) {
      console.error(`[ClashService] 测试代理延迟失败: ${error.message}`);
      return -1; // 表示测试失败
    }
  }

  /**
   * 切换代理
   * @param {string} groupName - 代理组名称
   * @param {string} proxyName - 要切换到的代理名称
   * @returns {Promise<boolean>} 是否成功
   */
  async switchProxy(groupName, proxyName) {
    if (!this.externalController) {
      throw new Error('未配置外部控制器地址');
    }

    try {
      const url = `http://${this.externalController}/proxies/${encodeURIComponent(groupName)}`;
      await axios.put(url, { name: proxyName });
      console.log(`[ClashService] 已切换代理组 ${groupName} 至 ${proxyName}`);
      return true;
    } catch (error) {
      console.error(`[ClashService] 切换代理失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 获取当前选择的代理
   * @param {string} groupName - 代理组名称
   * @returns {Promise<string>} 当前代理名称
   */
  async getCurrentProxy(groupName) {
    if (!this.externalController) {
      throw new Error('未配置外部控制器地址');
    }

    try {
      const url = `http://${this.externalController}/proxies/${encodeURIComponent(groupName)}`;
      const response = await axios.get(url);
      return response.data.now;
    } catch (error) {
      console.error(`[ClashService] 获取当前代理失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ClashService; 