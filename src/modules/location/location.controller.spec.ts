import { Test, TestingModule } from '@nestjs/testing';

import { LocationController } from './location.controller';
import { CreateLocationDto, UpdateLocationDto, LocationQueryDto } from './location.dto';
import {
  CreateLocationResponse,
  GetLocationDetailResponse,
  LocationListItemResponse,
  LocationTreeResponse,
} from './location.response';
import { LocationUseCase } from './location.use-case';

import { Pagination } from '~/common/paginate/pagination';

describe('LocationController', () => {
  let controller: LocationController;
  let useCase: jest.Mocked<LocationUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationUseCase,
          useValue: {
            list: jest.fn(),
            getTrees: jest.fn(),
            detail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    useCase = module.get(LocationUseCase);
  });

  it('should list locations with pagination', async () => {
    const dto: LocationQueryDto = { page: 1, limit: 10, q: 'office' };
    const mockResult = new Pagination<LocationListItemResponse>([], { total: 0 });
    useCase.list.mockResolvedValue(mockResult);

    const result = await controller.list(dto);
    expect(result).toEqual(mockResult);
    expect(useCase.list).toHaveBeenCalledWith(dto);
  });

  it('should get location trees', async () => {
    const mockTrees: LocationTreeResponse[] = [
      {
        id: 1,
        name: 'Headquarters',
        building: 'HQ Bldg',
        number: '001',
        area: 'North',
        children: [],
      },
    ];
    useCase.getTrees.mockResolvedValue(mockTrees);

    const result = await controller.getTrees();
    expect(result).toEqual(mockTrees);
    expect(useCase.getTrees).toHaveBeenCalled();
  });

  it('should get location detail', async () => {
    const id = 1;
    const mockDetail: GetLocationDetailResponse = {
      id,
      name: 'Main Office',
      building: 'Building A',
      number: '101',
      area: 'Central',
      createdAt: new Date(),
      updatedAt: new Date(),
      parent: undefined,
    };
    useCase.detail.mockResolvedValue(mockDetail);

    const result = await controller.detail(id);
    expect(result).toEqual(mockDetail);
    expect(useCase.detail).toHaveBeenCalledWith(id);
  });

  it('should create a location', async () => {
    const dto: CreateLocationDto = {
      name: 'New Location',
      building: 'Tower B',
      number: '202',
      area: 'South',
      parentId: 2,
    };
    const mockResponse: CreateLocationResponse = { id: 99 };
    useCase.create.mockResolvedValue(mockResponse);

    const result = await controller.create(dto);
    expect(result).toEqual(mockResponse);
    expect(useCase.create).toHaveBeenCalledWith(dto);
  });

  it('should update a location', async () => {
    const id = 1;
    const dto: UpdateLocationDto = {
      name: 'Updated Name',
      number: '999',
      area: 'East',
      parentId: 3,
    };

    await controller.update(id, dto);
    expect(useCase.update).toHaveBeenCalledWith(id, dto);
  });

  it('should delete a location', async () => {
    const id = 1;

    await controller.delete(id);
    expect(useCase.delete).toHaveBeenCalledWith(id);
  });
});
