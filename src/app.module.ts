import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AllExceptionsFilter } from '~/common/filters/any-exception.filter';
import { TransformInterceptor } from '~/common/interceptors/transform.interceptor';
import config from '~/config';
import { LocationModule } from '~/modules/location/location.module';
import { DatabaseModule } from '~/shared/database/database.module';
import { SharedModule } from '~/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env'],
      load: [...Object.values(config)],
    }),
    SharedModule,
    DatabaseModule,
    LocationModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
