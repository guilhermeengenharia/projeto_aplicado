/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel, Logger } from '../../../../logger';
import { LogActions } from '../../../../logger/log';

export interface RequestLogPluginOptions {
  /**
   * Log level that the request log will be printed
   * Attention it does not means the application log level it only effects the request log level
   * @default DEBUG
   */
  logLevel?: LogLevel;
  /**
   * Indicates if should encode(base64) the request payload
   * @default true
   */
  encodePayload?: boolean;
  /**
   * Indicate All request paths that should not be logged
   */
  pathNotLogg?: Array<string>;
}
export interface IRequestLog {
  method: string;
  path: string;
  route: string;
  agent: string | undefined;
  ip: string;
  query: unknown;
  params: unknown;
  data?: any;
  headers?: any;
  body?: any;
}

export interface IResponseLog {
  method: string;
  path: string;
  route: string;
  agent: string | undefined;
  ip: string | undefined;
  duration: number;
  statusCode: number;
  query: unknown;
  params: unknown;
  data?: any;
  headers?: any;
}

export class RequestResponseLogPlugin {
  private static log(log: { [key: string]: unknown }, level?: LogLevel): void {
    level = level || LogLevel.INFO;
    switch (level) {
      case LogLevel.INFO:
        Logger.info(log);
        break;
      case LogLevel.WARN:
        Logger.warn(log);
        break;
      case LogLevel.ERROR:
        Logger.error(log);
        break;
      default:
        Logger.debug(log);
        break;
    }
  }

  static logRequest(reqLog: IRequestLog, options?: RequestLogPluginOptions): void {
    if (options && options.pathNotLogg && options.pathNotLogg.find(p => p === reqLog.path)) {
      return;
    }
    const logObject = {
      action: LogActions.Request,
      ...reqLog,
    };
    RequestResponseLogPlugin.log(logObject, options ? options.logLevel : undefined);
  }

  static logResponse(reqLog: IResponseLog, options?: RequestLogPluginOptions): void {
    if (options && options.pathNotLogg && options.pathNotLogg.find(p => p === reqLog.path)) {
      return;
    }
    const logObject = {
      action: LogActions.Response,
      ...reqLog,
    };
    RequestResponseLogPlugin.log(logObject, options ? options.logLevel : undefined);
  }
}
