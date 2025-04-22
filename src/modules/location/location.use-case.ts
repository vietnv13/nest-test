import { Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { CreateLocationDto, LocationQueryDto, UpdateLocationDto } from './location.dto';
import {
  CreateLocationResponse,
  GetLocationDetailResponse,
  LocationListItemResponse,
  LocationTreeResponse,
} from './location.response';

import { Order } from '~/common/dto/pager.dto';
import { LocationFoundException } from '~/common/exceptions/not-found.exception';
import { Pagination } from '~/common/paginate/pagination';
import { LocationService } from '~/shared/services/location/location.service';

@Injectable()
export class LocationUseCase {
  constructor(private readonly locationService: LocationService) {}

  async list(dto: LocationQueryDto): Promise<Pagination<LocationListItemResponse>> {
    const { page, limit, orderField = 'updatedAt', order = Order.DESC, q } = dto;

    const alias = 'location';
    const qb = this.locationService
      .getQueryBuilder(alias)
      .leftJoinAndSelect(`${alias}.parent`, `parent`)
      .orderBy(`${alias}.${orderField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    if (q) {
      qb.where(`${alias}.building ILIKE :q OR ${alias}.name ILIKE :q OR ${alias}.number ILIKE :q`, {
        q: `%${q}%`,
      });
    }

    const [list, total] = await qb.getManyAndCount();

    return {
      list,
      metadata: { total },
    };
  }

  async getTrees(): Promise<LocationTreeResponse[]> {
    const locationTrees = await this.locationService.getTrees();
    return locationTrees.map((node) => this.transformNode(node));
  }

  async detail(id: number): Promise<GetLocationDetailResponse> {
    const location = await this.locationService.findOne({ where: { id }, relations: ['parent'] });

    if (!location) {
      throw new LocationFoundException();
    }

    return location;
  }

  async create(dto: CreateLocationDto): Promise<CreateLocationResponse> {
    const { parentId, ...rest } = dto;

    let parent = undefined;

    if (parentId) {
      parent = await this.locationService.findById(parentId);

      if (!parent) {
        throw new LocationFoundException();
      }
    }

    const { id } = await this.locationService.create({ ...rest, parent });

    return { id };
  }

  async update(id: number, dto: UpdateLocationDto): Promise<void> {
    const location = await this.locationService.findById(id);

    if (!location) {
      throw new LocationFoundException();
    }

    const { parentId, ...rest } = dto;

    let parent = undefined;

    if (parentId) {
      parent = await this.locationService.findById(parentId);

      if (!parent) {
        throw new LocationFoundException();
      }
    }

    this.locationService.update(id, { ...rest, parent });
  }

  async delete(id: number): Promise<void> {
    this.locationService.delete(id);
  }

  private transformNode(node: LocationTreeResponse): LocationTreeResponse {
    return {
      id: node.id,
      building: node.building,
      name: node.name,
      number: node.number,
      area: node.area,
      children: (node.children ?? []).map((child) => this.transformNode(child)),
    };
  }
}
