import { appRegToken, IAppConfig, AppConfig } from './app.config';
import { dbRegToken, IDatabaseConfig, DatabaseConfig } from './database.config';
import { ISwaggerConfig, swaggerRegToken, SwaggerConfig } from './swagger.config';

export * from './app.config';
export * from './database.config';
export * from './swagger.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [dbRegToken]: IDatabaseConfig;
  [swaggerRegToken]: ISwaggerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  DatabaseConfig,
  SwaggerConfig,
};
