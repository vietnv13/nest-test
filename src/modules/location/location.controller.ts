import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateLocationDto, LocationQueryDto, UpdateLocationDto } from './location.dto';
import {
  CreateLocationResponse,
  GetLocationDetailResponse,
  LocationListItemResponse,
  LocationTreeResponse,
} from './location.response';
import { LocationUseCase } from './location.use-case';

import { ApiResult } from '~/common/decorators/api-result.decorator';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { Pagination } from '~/common/paginate/pagination';

@ApiTags('Location')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationUseCase: LocationUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of locations' })
  @ApiResult({ type: [LocationListItemResponse], isPage: true })
  async list(@Query() dto: LocationQueryDto): Promise<Pagination<LocationListItemResponse>> {
    return this.locationUseCase.list(dto);
  }

  @Get('trees')
  @ApiOperation({ summary: 'Get full location tree structure (recursive)' })
  @ApiResult({ type: [LocationTreeResponse] })
  async getTrees(): Promise<LocationTreeResponse[]> {
    return this.locationUseCase.getTrees();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detail of a specific location' })
  @ApiResult({ type: [GetLocationDetailResponse] })
  async detail(@IdParam() id: number): Promise<GetLocationDetailResponse> {
    return this.locationUseCase.detail(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResult({ type: [CreateLocationResponse] })
  async create(@Body() dto: CreateLocationDto): Promise<CreateLocationResponse> {
    return this.locationUseCase.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing location' })
  @ApiNoContentResponse()
  async update(@IdParam() id: number, @Body() dto: UpdateLocationDto): Promise<void> {
    this.locationUseCase.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a location by ID' })
  @ApiNoContentResponse()
  async delete(@IdParam() id: number): Promise<void> {
    this.locationUseCase.delete(id);
  }
}
