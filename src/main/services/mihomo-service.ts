import { spawn, ChildProcess } from 'child_process';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

class MihomoService {
  private static instance: MihomoService;
  private mihomoProcess: ChildProcess | null = null;

  private constructor() {}

  public static getInstance(): MihomoService {
    if (!MihomoService.instance) {
      MihomoService.instance = new MihomoService();
    }
    return MihomoService.instance;
  }

  private getMihomoPath(): string {
    // 在开发环境中，我们期望 mihomo.exe 在项目根目录的 resources 文件夹下
    if (!app.isPackaged) {
      return path.resolve(app.getAppPath(), 'resources', 'mihomo.exe');
    }
    
    // 在生产环境中 (打包后)，resources 目录通常与应用的可执行文件在同一目录下
    // app.getAppPath() 会指向 asar 文件，所以我们需要回到上一层目录
    return path.resolve(path.dirname(app.getAppPath()), 'resources', 'mihomo.exe');
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.mihomoProcess) {
        console.log('[MihomoService] Mihomo is already running.');
        return resolve();
      }

      const mihomoPath = this.getMihomoPath();

      if (!fs.existsSync(mihomoPath)) {
        const errorMsg = `Mihomo executable not found at: ${mihomoPath}`;
        console.error(`[MihomoService] ${errorMsg}`);
        return reject(new Error(errorMsg));
      }

      console.log(`[MihomoService] Starting mihomo from: ${mihomoPath}`);

      this.mihomoProcess = spawn(mihomoPath, [
        // 示例: '-d', path.join(app.getPath('userData'), 'mihomo_config')
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
      
      // 增加一个短暂的延时，以确保进程已完全启动并监听端口
      setTimeout(() => {
        if (this.mihomoProcess) {
          console.log('[MihomoService] Mihomo service started successfully.');
          resolve();
        } else {
          // 如果进程在启动后立即退出，这里会捕获到
          reject(new Error('Mihomo process failed to start or exited prematurely.'));
        }
      }, 1500);
    });
  }

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

  public isRunning(): boolean {
    return this.mihomoProcess !== null;
  }
}

export const mihomoService = MihomoService.getInstance();