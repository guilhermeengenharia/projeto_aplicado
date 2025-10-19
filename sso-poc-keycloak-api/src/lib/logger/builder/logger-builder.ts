/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, createLogger, transports, Logger } from 'winston';
import { v4 as uuid } from 'uuid';
import { Environment } from '../../env/environment';
import { LoggerContext } from '../log/loger-context';
import { LoggerConstants } from '../../constants';
import { LoggerConfigs } from '../log/logger-configs';

export class LoggerBuilder {

  private static loadInfoItems(
    item: unknown,
    info: Record<string, any>,
    text: string
  ): string {
    try {
      if (item instanceof TypeError || item instanceof Error) {
        info['errorMessage'] = item.message;
        info['stackError'] = item.stack;
      } else if (typeof item === 'string') {
        text = `${!text ? item : `${text} ${item}`}`;
      } else if (typeof item === 'object' && item !== null) {
        const obj = item as Record<string, any>;
        Object.keys(obj).forEach((key) => {
          if (LoggerBuilder.shouldHide(key) && process.env.SHOW_SENSETIVE_LOG !== 'true') {
            info[key] = LoggerConstants.HidenLogFieldLabel;
          } else {
            info[key] = obj[key];
          }
        });
      }
    } catch (error) {
      info.__internalLoggerError = error;
    }
    return text;
  }

  private static shouldHide(key: string): boolean {
    key = key || '';
    key = key.toLocaleLowerCase();
    return LoggerConfigs.hiddenFields.includes(key);
  }

  private static defaultCustom = (info: { [key: string]: any }, opts: any) => {
    if (opts.yell) {
      info.message = info.message.toUpperCase();
    } else if (opts.whisper) {
      info.message = info.message.toLowerCase();
    }

    info.level = info.level.toUpperCase();
    info.correlationId = LoggerContext.getCorrelationId() || uuid();
    const extraData = LoggerContext.getLogInfoData();
    if (extraData) {
      Object.keys(extraData).forEach(key => {
        info[key] = extraData[key];
      });
    }

    let text = '';
    for (const item of info.message) {
      if (!item) {
        continue;
      }
      if (typeof item === 'string' || typeof item === 'number') {
        text = `${!text ? item : `${text} ${item}`}`;
      } else if (Array.isArray(item)) {
        for (const arrayItem of item) {
          text = LoggerBuilder.loadInfoItems(arrayItem, info, text);
        }
      } else if (typeof item === 'object') {
        text = LoggerBuilder.loadInfoItems(item, info, text);
      } else {
        info['__data'] = item;
      }
    }
    delete info.message;

    info.message = text;

    return info;
  };

  /**
   * You can specify a custom json formatter function that will be called everytime before print a log
   * @param [customFormat]
   * @returns instance {Logger}
   */
  static getLogger(custom?: (info: any, opts?: any) => any): Logger {
    return process.env.NODE_ENV === Environment.LOCAL
      ? LoggerBuilder.createLocalWinstonLogger(custom)
      : LoggerBuilder.createDefaultWinstonLogger(custom);
  }

  private static getLogLevel(): string {
    return process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : 'debug';
  }

  /**
   * Creates local winston logger
   * @returns local winston logger {Logger}
   */
  private static createLocalWinstonLogger(
    custom: (info: any, opts?: any) => any = LoggerBuilder.defaultCustom
  ): Logger {
    return createLogger({
      level: LoggerBuilder.getLogLevel(),
      format: format.combine(
        format.json(),
        LoggerBuilder.customJsonFormat(custom),
        format.timestamp(),
        format.prettyPrint()
      ),
      transports: [new transports.Console()],
    });
  }

  /**
   * Creates aws winston logger
   * @returns aws winston logger {Logger}
   */
  private static createDefaultWinstonLogger(
    custom: (info: any, opts?: any) => any = (info, opts) => LoggerBuilder.defaultCustom(info, opts)
  ): Logger {
    return createLogger({
      level: LoggerBuilder.getLogLevel(),
      format: format.combine(
        format.timestamp(),
        LoggerBuilder.customJsonFormat(custom),
        format.json()
      ),
      transports: [new transports.Console()],
    });
  }

  /**
   * Customs json format
   * @returns
   */
  private static customJsonFormat(
    custom: (info: any, opts?: any) => any = (info, opts) => LoggerBuilder.defaultCustom(info, opts)
  ) {
    const customJson = format(custom);
    return customJson();
  }
}
