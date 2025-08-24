import { spawn, ChildProcess } from 'child_process';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import axios, { AxiosInstance } from 'axios';

interface MihomoConfig {
  port: number;
  'socks-port': number;
  'redir-port': number;
  'mixed-port': number;
  'allow-lan': boolean;
  mode: string;
  'log-level': string;
  ipv6: boolean;
  'external-controller': string;
  proxies: unknown[];
  'proxy-groups': unknown[];
  rules: unknown[];
  [key: string]: unknown;
}

/**
 * MihomoService 类负责管理 Mihomo 核心进程的启动、停止和配置管理。
 * 它提供了与 Mihomo 进程交互的方法，包括加载和保存配置文件。
 */
class MihomoService {
  private static instance: MihomoService;
  private mihomoProcess: ChildProcess | null = null;
  private configDir: string;
  private configPath: string;
  private apiClient: AxiosInstance;

  /**
   * 私有构造函数，确保单例模式。
   * 初始化配置文件路径，并在文件不存在时创建默认配置。
   */
  private constructor() {
    // 使用专门的配置目录
    this.configDir = path.join(app.getPath('userData'), 'mihomo_config');
    this.configPath = path.join(this.configDir, 'config.yaml');
    
    // 确保配置目录存在
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
    
    // 确保配置文件存在
    if (!fs.existsSync(this.configPath)) {
      this.createDefaultConfig();
    }
    
    // 初始化 API 客户端
    this.apiClient = axios.create({
      baseURL: 'http://127.0.0.1:9090', // 默认外部控制器地址
      timeout: 5000
    });
  }

  /**
   * 获取 MihomoService 的单例实例。
   * @returns MihomoService 的单例实例。
   */
  public static getInstance(): MihomoService {
    if (!MihomoService.instance) {
      MihomoService.instance = new MihomoService();
    }
    return MihomoService.instance;
  }

  /**
   * 获取 Mihomo 可执行文件的路径。
   * 在开发环境和生产环境中路径不同。
   * @returns Mihomo 可执行文件的完整路径。
   */
  private getMihomoPath(): string {
    const appName = 'mihomo.exe'; // Windows 平台
    // const appName = 'mihomo'; // Linux/macOS 平台
    
    // 在开发环境中，我们期望 mihomo 可执行文件在项目根目录的 resources 文件夹下
    if (!app.isPackaged) {
      console.log(`[MihomoService] Running in development mode. App path: ${app.getAppPath()}`);
      const devPath = path.resolve(app.getAppPath(), '..', 'resources', appName);
      console.log(`[MihomoService] Looking for mihomo in development path: ${devPath}`);
      return devPath;
    }
    
    // 在生产环境中 (打包后)，resources 目录通常与应用的可执行文件在同一目录下
    // app.getAppPath() 会指向 asar 文件，所以我们需要回到上一层目录
    console.log(`[MihomoService] Running in production mode. App path: ${app.getAppPath()}`);
    const prodPath = path.resolve(path.dirname(app.getAppPath()), 'resources', appName);
    console.log(`[MihomoService] Looking for mihomo in production path: ${prodPath}`);
    return prodPath;
  }

  /**
   * 创建默认的 Mihomo 配置文件。
   * 当配置文件不存在时，会调用此方法创建一个带有基本配置的文件。
   */
  private createDefaultConfig(): void {
    const defaultConfig = {
      port: 7890,
      'socks-port': 7891,
      'redir-port': 7892,
      'mixed-port': 7893,
      'allow-lan': false,
      mode: 'rule',
      'log-level': 'info',
      ipv6: false,
      'external-controller': '127.0.0.1:9090',
      proxies: [],
      'proxy-groups': [],
      rules: []
    };

    try {
      fs.writeFileSync(this.configPath, yaml.dump(defaultConfig), 'utf8');
      console.log(`[MihomoService] Default config created at: ${this.configPath}`);
    } catch (error) {
      console.error(`[MihomoService] Failed to create default config: ${error}`);
    }
  }

  /**
   * 获取配置文件的路径。
   * @returns 配置文件的完整路径。
   */
  public getConfigPath(): string {
    return this.configPath;
  }

  /**
   * 获取配置目录的路径。
   * @returns 配置目录的完整路径。
   */
  public getConfigDir(): string {
    return this.configDir;
  }

  /**
   * 从文件系统加载 Mihomo 配置。
   * @returns 一个 Promise，解析为配置对象。
   */
  public loadConfig(): Promise<MihomoConfig> {
    return new Promise((resolve, reject) => {
      // 检查配置文件是否存在
      if (!fs.existsSync(this.configPath)) {
        // 如果配置文件不存在，创建默认配置
        this.createDefaultConfig();
      }
      
      fs.readFile(this.configPath, 'utf8', (err, data) => {
        if (err) {
          console.error(`[MihomoService] Failed to read config file: ${err}`);
          return reject(err);
        }
        
        try {
          const config = yaml.load(data);
          resolve(config);
        } catch (parseError) {
          console.error(`[MihomoService] Failed to parse config file: ${parseError}`);
          reject(parseError);
        }
      });
    });
  }

  /**
   * 将配置保存到文件系统。
   * @param config 要保存的配置对象。
   * @returns 一个 Promise，在保存成功时解析。
   */
  public saveConfig(config: MihomoConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // 确保配置目录存在
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }
      
      const yamlStr = yaml.dump(config);
      fs.writeFile(this.configPath, yamlStr, 'utf8', (err) => {
        if (err) {
          console.error(`[MihomoService] Failed to write config file: ${err}`);
          return reject(err);
        }
        console.log(`[MihomoService] Config saved to: ${this.configPath}`);
        resolve();
      });
    });
  }

  /**
   * 检查配置是否有效
   * @param config 配置对象
   * @returns 如果配置有效返回 true，否则返回 false
   */
  public isConfigValid(config: MihomoConfig): boolean {
    // 检查配置是否为对象且不为空
    if (!config || typeof config !== 'object' || Object.keys(config).length === 0) {
      return false;
    }
    
    // 检查必需的字段
    const requiredFields = ['port', 'mode'];
    for (const field of requiredFields) {
      if (config[field] === undefined) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * 启动 Mihomo 进程。
   * @returns 一个 Promise，在启动成功时解析。
   */
  public async start(): Promise<void> {
    if (this.mihomoProcess) {
      console.log('[MihomoService] Mihomo is already running.');
      return;
    }

    const mihomoPath = this.getMihomoPath();

    if (!fs.existsSync(mihomoPath)) {
      const errorMsg = `Mihomo executable not found at: ${mihomoPath}`;
      console.error(`[MihomoService] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // 检查配置文件是否存在
    if (!fs.existsSync(this.configPath)) {
      const errorMsg = `Config file not found at: ${this.configPath}`;
      console.error(`[MihomoService] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // 检查配置文件是否为空
    const configStat = fs.statSync(this.configPath);
    if (configStat.size === 0) {
      const errorMsg = `Config file is empty: ${this.configPath}`;
      console.error(`[MihomoService] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // 验证配置是否有效
    try {
      const config = await this.loadConfig();
      if (!this.isConfigValid(config)) {
        const errorMsg = `Config file is invalid: ${this.configPath}`;
        console.error(`[MihomoService] ${errorMsg}`);
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMsg = `Failed to validate config file: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`[MihomoService] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    return new Promise((resolve, reject) => {
      console.log(`[MihomoService] Starting mihomo from: ${mihomoPath}`);
      console.log(`[MihomoService] Using config directory: ${this.configDir}`);

      // 使用 -d 参数指定配置目录
      this.mihomoProcess = spawn(mihomoPath, [
        '-d', this.configDir
      ]);

      this.mihomoProcess.stdout?.on('data', (data) => {
        console.log(`[MihomoService] stdout: ${data.toString().trim()}`);
      });

      this.mihomoProcess.stderr?.on('data', (data) => {
        console.error(`[MihomoService] stderr: ${data.toString().trim()}`);
      });

      this.mihomoProcess.on('close', (code) => {
        console.log(`[MihomoService] Mihomo process exited with code ${code}`);
        this.mihomoProcess = null;
      });

      this.mihomoProcess.on('error', (err) => {
        console.error('[MihomoService] Failed to start Mihomo process.', err);
        this.mihomoProcess = null;
        reject(err);
      });
      
      // 增加一个更长的延时，以确保进程已完全启动并监听端口
      // 同时增加对 API 端口的检查
      let attempts = 0;
      const maxAttempts = 20; // 最多尝试20次
      const checkInterval = 500; // 每500ms检查一次
      
      const checkApi = () => {
        attempts++;
        console.log(`[MihomoService] Checking API availability (attempt ${attempts}/${maxAttempts})...`);
        
        this.apiClient.get('/version')
          .then(response => {
            console.log(`[MihomoService] Mihomo API is available. Version: ${response.data.version}`);
            console.log('[MihomoService] Mihomo service started successfully.');
            resolve();
          })
          .catch(err => {
            if (attempts < maxAttempts) {
              console.log(`[MihomoService] API not ready yet, retrying in ${checkInterval}ms...`);
              setTimeout(checkApi, checkInterval);
            } else {
              console.error('[MihomoService] Mihomo API failed to become available after maximum attempts.');
              console.error('[MihomoService] Last error:', err.message);
              // 即使 API 不可用，我们也认为 Mihomo 进程已经启动
              // 因为有些配置可能禁用了外部控制器
              if (this.mihomoProcess) {
                console.log('[MihomoService] Mihomo process seems to be running, resolving start promise.');
                resolve();
              } else {
                reject(new Error('Mihomo process failed to start or exited prematurely.'));
              }
            }
          });
      };
      
      // 等待1.5秒后开始检查 API
      setTimeout(checkApi, 1500);
    });
  }

  /**
   * 停止 Mihomo 进程。
   * @returns 一个 Promise，在停止成功时解析。
   */
  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.mihomoProcess && !this.mihomoProcess.killed) {
        const killed = this.mihomoProcess.kill();
        if (killed) {
          console.log('[MihomoService] Mihomo service stopped successfully.');
        } else {
          console.error('[MihomoService] Failed to stop Mihomo service.');
        }
        this.mihomoProcess = null;
      } else {
        console.log('[MihomoService] Mihomo service is not running.');
      }
      resolve();
    });
  }

  /**
   * 检查 Mihomo 进程是否正在运行。
   * @returns 如果进程正在运行则返回 true，否则返回 false。
   */
  public isRunning(): boolean {
    return this.mihomoProcess !== null;
  }

  /**
   * 从VPN服务提供商的URL获取配置
   * @param url VPN服务提供商的配置URL
   * @returns 一个 Promise，解析为获取到的配置对象
   */
  public async fetchConfigFromURL(url: string): Promise<any> {
    try {
      console.log(`[MihomoService] Fetching config from URL: ${url}`);
      const response = await axios.get(url, {
        timeout: 10000, // 10秒超时
        headers: {
          'User-Agent': 'Catalyst-App/1.0'
        }
      });
      
      // 尝试解析响应内容为YAML
      const config = yaml.load(response.data);
      
      // 验证配置是否有效
      if (!this.isConfigValid(config)) {
        throw new Error('Fetched config is invalid');
      }
      
      console.log('[MihomoService] Config fetched and parsed successfully');
      return config;
    } catch (error) {
      console.error('[MihomoService] Failed to fetch config from URL:', error);
      throw new Error(`Failed to fetch config from URL: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取所有代理和策略组信息
   * @returns 一个 Promise，解析为代理和策略组信息对象
   */
  public async getProxies(): Promise<any> {
    try {
      const response = await this.apiClient.get('/proxies');
      return response.data;
    } catch (error) {
      console.error('[MihomoService] Failed to get proxies:', error);
      throw error;
    }
  }

  /**
   * 选择代理组中的特定代理
   * @param groupName 代理组名称
   * @param proxyName 代理节点名称
   * @returns 一个 Promise，在选择成功时解析
   */
  public async selectProxy(groupName: string, proxyName: string): Promise<void> {
    try {
      await this.apiClient.put(`/proxies/${encodeURIComponent(groupName)}`, {
        name: proxyName
      });
    } catch (error) {
      console.error('[MihomoService] Failed to select proxy:', error);
      throw error;
    }
  }
  
  /**
   * 测试代理节点的延迟
   * @param proxyName 代理节点名称
   * @returns 一个 Promise，解析为延迟测试结果
   */
  public async testProxyDelay(proxyName: string): Promise<number> {
    try {
      const response = await this.apiClient.get(`/proxies/${encodeURIComponent(proxyName)}/delay`, {
        params: {
          timeout: 5000,
          url: 'http://www.gstatic.com/generate_204'
        }
      });
      return response.data.delay;
    } catch (error) {
      console.error(`[MihomoService] Failed to test delay for proxy ${proxyName}:`, error);
      throw error;
    }
  }
}

export const mihomoService = MihomoService.getInstance();