import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationEntity } from '~/common/entities/location.entity';
import { LoggerModule } from '~/shared/logger/logger.module';
import { LocationService } from '~/shared/services/location/location.service';

const services = [LocationService];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity]), LoggerModule.forRoot()],
  providers: [...services],
  exports: [...services, LoggerModule, TypeOrmModule],
})
export class SharedModule {}
