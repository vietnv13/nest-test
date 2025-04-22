import { Column, Entity, Index, Tree, TreeChildren, TreeParent } from 'typeorm';

import { CommonEntity } from './common.entity';

@Entity({ name: 'locations' })
@Tree('materialized-path')
export class LocationEntity extends CommonEntity {
  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false })
  building!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false })
  number!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  area!: string | null;

  @TreeChildren({ cascade: true })
  children: LocationEntity[];

  @TreeParent({ onDelete: 'SET NULL' })
  parent?: LocationEntity;
}
