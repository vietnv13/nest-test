import { ConfigType, registerAs } from '@nestjs/config';
import dotenv from 'dotenv';
import { DataSourceOptions, DataSource } from 'typeorm';

import { DatabaseNamingStrategy } from '~/common/strategies/database-naming.strategy';
import { env, envBoolean, envNumber } from '~/utils';

dotenv.config({ path: `.env` });

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: env('DB_HOST', '127.0.0.1'),
  port: envNumber('DB_PORT', 5432),
  username: env('DB_USERNAME'),
  password: env('DB_PASSWORD'),
  database: env('DB_DATABASE'),
  synchronize: envBoolean('DB_SYNCHRONIZE', false),
  entities: ['dist/common/entities/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  namingStrategy: new DatabaseNamingStrategy(),
};
export const dbRegToken = 'database';

export const DatabaseConfig = registerAs(dbRegToken, (): DataSourceOptions => dataSourceOptions);

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
