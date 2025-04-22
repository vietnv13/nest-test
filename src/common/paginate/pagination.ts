import { ObjectLiteral } from 'typeorm';

export interface PaginationMetaInterface extends ObjectLiteral {
  total: number;
}

export class Pagination<PaginationObject, T extends ObjectLiteral = PaginationMetaInterface> {
  constructor(
    public readonly list: PaginationObject[],
    public readonly metadata: T,
  ) {}
}
