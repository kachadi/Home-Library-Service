import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { AppModule } from './app.module';
import { CustomLoggerService } from './сommon/logger/logger.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(CustomLoggerService);

  process.on('uncaughtException', (error, origin) => {
    const date = new Date();
    const message = `${date.toLocaleString()}  |  Uncaught error : ${error}; Exception origin: ${origin}`;
    logger.error(message, date);
  });
  process.on('unhandledRejection', (reason, promise) => {
    const date = new Date();
    const message = `${date.toLocaleString()}  |  Unhandled Rejection at: ${promise}; Reason: ${reason};`;
    logger.warn(message, date);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = yaml.load(
    readFileSync(join(__dirname, '..', 'doc', 'api.yaml'), 'utf8'),
  ) as OpenAPIObject;

  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
