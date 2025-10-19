/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-rest-params */
import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { ExpressPlugin } from './types/express-plugin';
import {
  RequestResponseLogPlugin,
  RequestLogPluginOptions,
  IResponseLog,
} from './types/request-log-plugin';
import { LoggerConstants } from '../../../constants';
import { Logger, LoggerContext } from '../../../logger';
import { StorageContext } from '../../../cls';

function setCorrelationId(req: Request) {
  const correlationId = req.headers[LoggerConstants.CorrelationIdHeader] || uuid();
  LoggerContext.setCorrelationId(correlationId.toString());
}

function createRequestLogObject(req: Request) {
  return {
    method: req.method.toUpperCase(),
    path: req.path,
    route: req.route,
    agent: req.get('user-agent'),
    ip: req.hostname,
    query: req.query,
    params: req.params,
    headers: req.headers,
    body: req.body,
  };
}

function getResponseBody(chunks: Buffer[]) {
  try {
    if (chunks.length) {
      return Buffer.concat(chunks).toString('utf8');
    }
  } catch (err) {
    Logger.warn(err);
  }
  return '';
}

const ReqRespLogExpressPlugin: ExpressPlugin = {
  handler(options?: RequestLogPluginOptions) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await StorageContext.run(async () => {
        const startDate = new Date();
        setCorrelationId(req);
        const reqLog = createRequestLogObject(req);

        const write = res.write;
        const end = res.end;
        const chunks: Buffer[] = [];

        res.write = (...restArgs: any): any => {
          chunks.push(Buffer.from(restArgs[0]));
          return write.apply(res, restArgs);
        };        
               
        res.end = (...restArgs: any): any => {
          if (restArgs[0]) {
            chunks.push(Buffer.from(restArgs[0]));
          }
          try {
            res.setHeader(LoggerConstants.CorrelationIdHeader, LoggerContext.getCorrelationId());
          } catch (error) {
            console.log(error);
          }
          const respLog: IResponseLog = {
            method: req.method,
            path: reqLog.path,
            route: reqLog.route,
            agent: reqLog.agent,
            ip: reqLog.ip,
            duration: new Date().getTime() - startDate.getTime(),
            statusCode: res.statusCode,
            query: req.query,
            params: req.params,
            headers: res.getHeaders(),
            data: getResponseBody(chunks),
          };
          RequestResponseLogPlugin.logResponse(respLog, options || {});
          end.apply(res, restArgs);
        };

        next();
      });
    };
  },
};

export { ReqRespLogExpressPlugin };
