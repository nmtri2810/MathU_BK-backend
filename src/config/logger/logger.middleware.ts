import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as morgan from 'morgan';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    morgan('combined', {
      stream: { write: (message) => this.loggerService.log(message, 'HTTP') },
    })(req, res, next);
  }
}
