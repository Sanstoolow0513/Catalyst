export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private prefix: string;

  private constructor(prefix: string = 'App') {
    this.prefix = prefix;
    this.logLevel = this.getLogLevelFromEnv();
  }

  public static getInstance(prefix?: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(prefix);
    }
    return Logger.instance;
  }

  private getLogLevelFromEnv(): LogLevel {
    if (typeof process !== 'undefined' && process.env) {
      const envLevel = process.env.NODE_ENV;
      const logLevel = process.env.LOG_LEVEL;
      
      if (logLevel) {
        switch (logLevel.toUpperCase()) {
          case 'DEBUG': return LogLevel.DEBUG;
          case 'INFO': return LogLevel.INFO;
          case 'WARN': return LogLevel.WARN;
          case 'ERROR': return LogLevel.ERROR;
          case 'NONE': return LogLevel.NONE;
        }
      }
      
      if (envLevel === 'production') {
        return LogLevel.ERROR;
      } else if (envLevel === 'test') {
        return LogLevel.WARN;
      }
    }
    
    return LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const argsStr = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    return `[${timestamp}] [${level}] [${this.prefix}] ${message}${argsStr}`;
  }

  public debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, ...args));
    }
  }

  public info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, ...args));
    }
  }

  public warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, ...args));
    }
  }

  public error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, ...args));
    }
  }

  public setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public getLevel(): LogLevel {
    return this.logLevel;
  }

  public createChild(prefix: string): Logger {
    return new Logger(`${this.prefix}:${prefix}`);
  }
}

export const logger = Logger.getInstance();