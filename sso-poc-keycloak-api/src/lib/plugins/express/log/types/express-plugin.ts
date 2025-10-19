import { Request, Response, NextFunction } from 'express';
import { RequestLogPluginOptions } from './request-log-plugin';

export interface ExpressPlugin {
  handler?: (
    options?: RequestLogPluginOptions
  ) => (req: Request, res: Response, next: NextFunction) => void;
  register?: (
    options?: RequestLogPluginOptions
  ) => (err: Error, req: Request, res: Response, next: NextFunction) => void;
}
