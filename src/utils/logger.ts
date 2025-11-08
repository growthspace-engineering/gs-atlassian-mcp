import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

// Check if running as MCP server (stdio mode) - disable colors and use stderr
// When stdout is not a TTY, we're likely running as an MCP server via stdio
const isMcpServer = process.env.MCP_SERVER_MODE !== 'false' && !process.stdout.isTTY;

// Define colors for output (disabled when running as MCP server)
const COLORS = {
  RESET: isMcpServer ? '' : '\x1b[0m',
  RED: isMcpServer ? '' : '\x1b[31m',
  YELLOW: isMcpServer ? '' : '\x1b[33m',
  BLUE: isMcpServer ? '' : '\x1b[34m',
  GRAY: isMcpServer ? '' : '\x1b[90m'
};

// Use stderr for all logging when running as MCP server (stdout must be JSON only)
// For MCP servers, we must use stderr to avoid interfering with JSON protocol on stdout
const useStderr = isMcpServer;

// Get log level from environment variable
const getLogLevelFromEnv = (): LogLevel => {
  const logLevel = process.env.LOG_LEVEL?.toLowerCase();
  switch (logLevel) {
    case 'debug':
      return LogLevel.DEBUG;
    case 'info':
      return LogLevel.INFO;
    case 'warn':
      return LogLevel.WARN;
    case 'error':
      return LogLevel.ERROR;
    default:
      return LogLevel.INFO; // Default is INFO
  }
};

/**
 * Logger utility
 */
export class Logger {
  private static logLevel = getLogLevelFromEnv();
  private moduleName: string;

  /**
   * Initialize logger
   * @param moduleName Module name using the logger
   */
  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  /**
   * Log error
   * @param message Log message
   * @param data Additional data (optional)
   */
  error(message: string, data?: any): void {
    if (Logger.logLevel >= LogLevel.ERROR) {
      const output = `${COLORS.RED}[ERROR][${this.moduleName}]${COLORS.RESET} ${message}`;
      if (useStderr) {
        console.error(output);
        if (data) console.error(data);
      } else {
        console.error(output);
        if (data) console.error(data);
      }
    }
  }

  /**
   * Log warning
   * @param message Log message
   * @param data Additional data (optional)
   */
  warn(message: string, data?: any): void {
    if (Logger.logLevel >= LogLevel.WARN) {
      const output = `${COLORS.YELLOW}[WARN][${this.moduleName}]${COLORS.RESET} ${message}`;
      if (useStderr) {
        console.error(output);
        if (data) console.error(data);
      } else {
        console.warn(output);
        if (data) console.warn(data);
      }
    }
  }

  /**
   * Log info
   * @param message Log message
   * @param data Additional data (optional)
   */
  info(message: string, data?: any): void {
    if (Logger.logLevel >= LogLevel.INFO) {
      const output = `${COLORS.BLUE}[INFO][${this.moduleName}]${COLORS.RESET} ${message}`;
      if (useStderr) {
        console.error(output);
        if (data) console.error(data);
      } else {
        console.info(output);
        if (data) console.info(data);
      }
    }
  }

  /**
   * Log debug
   * @param message Log message
   * @param data Additional data (optional)
   */
  debug(message: string, data?: any): void {
    if (Logger.logLevel >= LogLevel.DEBUG) {
      const output = `${COLORS.GRAY}[DEBUG][${this.moduleName}]${COLORS.RESET} ${message}`;
      if (useStderr) {
        console.error(output);
        if (data) console.error(data);
      } else {
        console.debug(output);
        if (data) console.debug(data);
      }
    }
  }

  /**
   * Create a logger instance
   * @param moduleName Module name using the logger
   * @returns Logger instance
   */
  static getLogger(moduleName: string): Logger {
    return new Logger(moduleName);
  }

  /**
   * Set log level
   * @param level New log level
   */
  static setLogLevel(level: LogLevel): void {
    Logger.logLevel = level;
  }
}
