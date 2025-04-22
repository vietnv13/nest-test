import 'winston-daily-rotate-file';

import { ConsoleLoggerOptions, ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger as WinstonLogger, config, createLogger, format, transports } from 'winston';

import { ConfigKeyPaths } from '~/config';
import { isDev } from '~/utils';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

@Injectable()
export class LoggerService extends ConsoleLogger {
  private winstonLogger: WinstonLogger;

  constructor(
    protected readonly context: string,
    protected readonly options: ConsoleLoggerOptions,
    private readonly configService: ConfigService<ConfigKeyPaths>,
  ) {
    super(context, options);
    this.initWinston();
  }

  protected get level(): LogLevel {
    return this.configService.get('app.logger.level', {
      infer: true,
    }) as LogLevel;
  }

  protected get maxFiles(): number {
    return this.configService.get('app.logger.maxFiles', { infer: true });
  }

  protected initWinston(): void {
    this.winstonLogger = createLogger({
      levels: config.npm.levels,
      format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
      transports: [
        new transports.DailyRotateFile({
          level: this.level,
          filename: 'logs/app.%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: this.maxFiles,
          format: format.combine(format.timestamp(), format.json()),
          auditFile: 'logs/.audit/app.json',
        }),
        new transports.DailyRotateFile({
          level: LogLevel.ERROR,
          filename: 'logs/app-error.%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: this.maxFiles,
          format: format.combine(format.timestamp(), format.json()),
          auditFile: 'logs/.audit/app-error.json',
        }),
      ],
    });

    if (isDev) {
      this.winstonLogger.add(
        new transports.Console({
          level: this.level,
          format: format.combine(format.simple(), format.colorize({ all: true })),
        }),
      );
    }
  }

  verbose(message: any, context?: string): void {
    super.verbose.apply(this, [message, context]);

    this.winstonLogger.log(LogLevel.VERBOSE, message, { context });
  }

  debug(message: any, context?: string): void {
    super.debug.apply(this, [message, context]);

    this.winstonLogger.log(LogLevel.DEBUG, message, { context });
  }

  log(message: any, context?: string): void {
    super.log.apply(this, [message, context]);

    this.winstonLogger.log(LogLevel.INFO, message, { context });
  }

  warn(message: any, context?: string): void {
    super.warn.apply(this, [message, context]);

    this.winstonLogger.log(LogLevel.WARN, message);
  }

  error(message: any, stack?: string, context?: string): void {
    super.error.apply(this, [message, stack, context]);

    const hasStack = !!context;
    this.winstonLogger.log(LogLevel.ERROR, {
      context: hasStack ? context : stack,
      message: hasStack ? new Error(message) : message,
    });
  }
}
