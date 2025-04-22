import cluster from 'node:cluster';

import { HttpStatus, Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';

import { AppModule } from '~/app.module';
import { fastifyApp } from '~/common/adapters/fastify.adapter';
import { LoggingInterceptor } from '~/common/interceptors/logging.interceptor';
import { ConfigKeyPaths } from '~/config';
import { setupSwagger } from '~/setup-swagger';
import { LoggerService } from '~/shared/logger/logger.service';
import { isDev, isMainProcess } from '~/utils';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyApp, {
    bufferLogs: true,
    snapshot: true,
    logger: ['error', 'warn', 'fatal'],
  });

  const configService = app.get(ConfigService<ConfigKeyPaths>);

  const { port, globalPrefix } = configService.get('app', { infer: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  app.setGlobalPrefix(globalPrefix);

  if (isDev) {
    app.useGlobalInterceptors(new LoggingInterceptor());
  } else {
    app.enableShutdownHooks();
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      stopAtFirstError: true,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints!)[0];
            const msg = e.constraints![rule];
            return msg;
          })[0],
        ),
    }),
  );

  setupSwagger(app, configService);

  await app.listen(port, '0.0.0.0', async () => {
    app.useLogger(app.get(LoggerService));
    const url = await app.getUrl();
    const { pid } = process;
    const env = cluster.isPrimary;
    const prefix = env ? 'P' : 'W';

    if (!isMainProcess) {
      return;
    }

    const logger = new Logger('NestApplication');
    logger.log(`[${prefix + pid}] Server running on ${url}`);

    if (isDev) {
      logger.log(`[${prefix + pid}] OpenAPI: ${url}/docs`);
    }
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
