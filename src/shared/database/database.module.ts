import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerOptions, DataSource } from 'typeorm';

import { TypeORMLogger } from './typeorm-logger';

import { ConfigKeyPaths, IDatabaseConfig } from '~/config';
import { env } from '~/utils';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        let loggerOptions: LoggerOptions = env('DB_LOGGING') as 'all';

        try {
          loggerOptions = JSON.parse(loggerOptions);
        } catch {}

        return {
          ...configService.get<IDatabaseConfig>('database'),
          logging: loggerOptions,
          logger: new TypeORMLogger(loggerOptions),
        };
      },
      dataSourceFactory: async (options) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class DatabaseModule {}
