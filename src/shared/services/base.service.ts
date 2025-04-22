import { Logger } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseService<T extends { id?: number }> {
  protected readonly logger: Logger;
  protected entity: EntityTarget<T>;

  constructor(protected readonly repository: Repository<T>) {
    this.logger = new Logger(this.constructor.name);
    this.entity = repository.target;
  }

  async paginate({
    where,
    order,
    take,
    skip,
  }: {
    where?: FindOptionsWhere<T>;
    order?: FindOptionsOrder<T>;
    take?: number;
    skip?: number;
  }): Promise<[T[], number]> {
    return this.repository.findAndCount({ where, order, take, skip });
  }

  async create(data: DeepPartial<T>, manager?: EntityManager): Promise<T> {
    const entity = this.repository.create(data);
    return manager ? manager.save(this.entity, entity) : this.repository.save(entity);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findById(id: number): Promise<T | null> {
    return this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  async update(id: number, data: QueryDeepPartialEntity<T>, manager?: EntityManager): Promise<UpdateResult> {
    return manager ? manager.update(this.entity, id, data) : this.repository.update(id, data);
  }

  async delete(id: number, manager?: EntityManager): Promise<DeleteResult> {
    return manager ? manager.delete(this.entity, id) : this.repository.delete(id);
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({ where });
  }

  getQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }
}
