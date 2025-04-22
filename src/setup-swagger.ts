import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Response } from '~/common/model/response.model';
import { Pagination } from '~/common/paginate/pagination';
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from '~/config';

export function setupSwagger(app: INestApplication, configService: ConfigService<ConfigKeyPaths>): void {
  const { name, port } = configService.get<IAppConfig>('app')!;
  const { enable, path } = configService.get<ISwaggerConfig>('swagger')!;

  if (!enable) {
    return;
  }

  const documentBuilder = new DocumentBuilder().setTitle(name).setDescription(`${name} API document`).setVersion('1.0');

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: false,
    extraModels: [Response, Pagination],
  });

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const logger = new Logger('SwaggerModule');
  logger.log(`Api docs running on http://127.0.0.1:${port}/${path}`);
}
