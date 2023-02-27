import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomLoggerService } from 'src/logger/logger.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  @Inject()
  private readonly logger: CustomLoggerService;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toLocaleString(),
      message: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      responseBody.message = exception.message;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
