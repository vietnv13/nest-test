import { Test, TestingModule } from '@nestjs/testing';

import { LocationUseCase } from './location.use-case';

import { LocationEntity } from '~/common/entities/location.entity';
import { LocationFoundException } from '~/common/exceptions/not-found.exception';
import { LocationService } from '~/shared/services/location/location.service';

const mockLocation: LocationEntity = {
  id: 1,
  building: 'Building A',
  name: 'Main Entrance',
  number: '101',
  area: 'Zone A',
  createdAt: new Date(),
  updatedAt: new Date(),
  parent: null,
  children: [],
} as LocationEntity;

describe('LocationUseCase', () => {
  let useCase: LocationUseCase;
  let locationService: jest.Mocked<LocationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationUseCase,
        {
          provide: LocationService,
          useValue: {
            getQueryBuilder: jest.fn(),
            getTrees: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<LocationUseCase>(LocationUseCase);
    locationService = module.get(LocationService);
  });

  describe('list', () => {
    it('should return paginated results', async () => {
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ id: 1 }], 1]),
      };
      locationService.getQueryBuilder.mockReturnValue(mockQb as any);

      const result = await useCase.list({ page: 1, limit: 10 });
      expect(result).toEqual({ list: [{ id: 1 }], metadata: { total: 1 } });
    });

    it('should apply query filter when q is present', async () => {
      const where = jest.fn().mockReturnThis();
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where,
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      locationService.getQueryBuilder.mockReturnValue(mockQb as any);

      await useCase.list({ page: 1, limit: 10, q: 'searchTerm' });
      expect(where).toHaveBeenCalled();
    });
  });

  describe('getTrees', () => {
    it('should return transformed tree data', async () => {
      const trees = [{ id: 1, building: 'A', name: 'Main', number: '101', area: '', children: [] }];
      locationService.getTrees.mockResolvedValue(trees as any);

      const result = await useCase.getTrees();
      expect(result[0].id).toBe(1);
    });
  });

  describe('detail', () => {
    it('should return location detail if found', async () => {
      const location = { id: 1 };
      locationService.findOne.mockResolvedValue(location as any);

      const result = await useCase.detail(1);
      expect(result).toEqual(location);
    });

    it('should throw if not found', async () => {
      locationService.findOne.mockResolvedValue(null);
      await expect(useCase.detail(1)).rejects.toThrow(LocationFoundException);
    });
  });

  describe('create', () => {
    it('should create a location without parent', async () => {
      locationService.create.mockResolvedValue({ id: 1 } as any);
      const result = await useCase.create({ building: 'A', name: 'N', number: '1' });
      expect(result).toEqual({ id: 1 });
    });

    it('should create a location with parent', async () => {
      locationService.findById.mockResolvedValue({ id: 99 } as any);
      locationService.create.mockResolvedValue({ id: 2 } as any);
      const result = await useCase.create({ building: 'B', name: 'Child', number: '2', parentId: 99 });
      expect(result).toEqual({ id: 2 });
    });

    it('should throw if parent not found', async () => {
      locationService.findById.mockResolvedValue(null);
      await expect(useCase.create({ building: 'B', name: 'Child', number: '2', parentId: 123 })).rejects.toThrow(
        LocationFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a location', async () => {
      locationService.findById.mockResolvedValueOnce(mockLocation).mockResolvedValueOnce(null);
      await useCase.update(1, { number: '101' });
      expect(locationService.update).toHaveBeenCalledWith(1, { number: '101', parent: undefined });
    });

    it('should throw if location not found', async () => {
      locationService.findById.mockResolvedValueOnce(null);
      await expect(useCase.update(1, { number: '101' })).rejects.toThrow(LocationFoundException);
    });

    it('should throw if parent not found', async () => {
      locationService.findById.mockResolvedValueOnce(mockLocation).mockResolvedValueOnce(null);
      await expect(useCase.update(1, { number: '101', parentId: 999 })).rejects.toThrow(LocationFoundException);
    });
  });

  describe('delete', () => {
    it('should call delete on service', async () => {
      await useCase.delete(1);
      expect(locationService.delete).toHaveBeenCalledWith(1);
    });
  });
});
