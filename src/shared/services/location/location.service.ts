import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { LocationEntity } from '~/common/entities/location.entity';
import { BaseService } from '~/shared/services/base.service';

@Injectable()
export class LocationService extends BaseService<LocationEntity> {
  constructor(
    @InjectRepository(LocationEntity)
    protected locationRep: Repository<LocationEntity>,
    @InjectRepository(LocationEntity)
    protected treeLocationRep: TreeRepository<LocationEntity>,
  ) {
    super(locationRep);
  }

  async getTrees(): Promise<LocationEntity[]> {
    return this.treeLocationRep.findTrees();
  }
}
