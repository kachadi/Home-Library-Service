import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: CustomLoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const start = Date.now();
    response.on('finish', () => {
      const { method, originalUrl, body } = request;
      const { statusCode, statusMessage } = response;
      const time = Date.now() - start;
      const date = new Date();
      const message = `${date.toLocaleString()}  |  Method: ${method}; Status code: ${statusCode}; Status message: ${statusMessage}; URL: ${originalUrl}; Body: ${JSON.stringify(
        body,
      )}; +${time}ms`;
      if (statusCode >= 500) {
        this.logger.error(message, date);
      } else if (statusCode >= 400) {
        this.logger.warn(message, date);
      } else {
        this.logger.log(message, date);
      }
    });

    next();
  }
}
