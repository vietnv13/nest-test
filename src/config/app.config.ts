import { ConfigType, registerAs } from '@nestjs/config';

import { env, envBoolean, envNumber } from '~/utils';

export const appRegToken = 'app';

const globalPrefix = env('GLOBAL_PREFIX', 'api');

export const AppConfig = registerAs(appRegToken, () => ({
  name: env('APP_NAME'),
  port: envNumber('APP_PORT', 3000),
  baseUrl: env('APP_BASE_URL'),
  globalPrefix,
  logger: {
    level: env('LOGGER_LEVEL'),
    maxFiles: envNumber('LOGGER_MAX_FILES'),
  },
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
