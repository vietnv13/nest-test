import { Module } from '@nestjs/common';

import { LocationController } from './location.controller';
import { LocationUseCase } from './location.use-case';

@Module({
  controllers: [LocationController],
  providers: [LocationUseCase],
})
export class LocationModule {}
