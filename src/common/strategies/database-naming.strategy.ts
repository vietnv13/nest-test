import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

export const IdentifierLengthLimit = 63;

export class DatabaseNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  private joinColumns(columnNames: string[]): string {
    return columnNames.join('_');
  }

  private getPartialIndexNameSuffix(tableOrName: Table | string, columnNames: string[], where: string): string {
    const whereClauseMap: Record<string, string> = {
      '"deletedAt" IS NULL': `deletedAt_IS_NULL`,
    };

    if (whereClauseMap[where]) {
      return `WHERE_${whereClauseMap[where]}`;
    }

    const generatedIndexName = super.indexName(tableOrName, columnNames, where);
    const { 1: hash } = generatedIndexName.split('IDX_');

    return `WHERE_${hash}`;
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    return `PK_${this.getTableName(tableOrName)}_${this.joinColumns(columnNames)}`.slice(0, IdentifierLengthLimit);
  }

  foreignKeyName(
    referencingTableOrName: Table | string,
    referencingColumnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    const referencingTableName = this.getTableName(referencingTableOrName);

    const referencingReferencedGroup = referencingColumnNames.map((referencingColumn, index) => {
      return `${referencingTableName}_${referencingColumn}_${referencedTablePath}_${referencedColumnNames[index]}`;
    });

    return `FK_${referencingReferencedGroup.join('_')}`.slice(0, IdentifierLengthLimit);
  }

  indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    let indexName = `IDX_${this.getTableName(tableOrName)}_${this.joinColumns(columnNames)}`;

    if (where) {
      const suffix = this.getPartialIndexNameSuffix(tableOrName, columnNames, where);
      indexName = `${indexName}_${suffix}`;
    }

    return indexName.slice(0, IdentifierLengthLimit);
  }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    return `UQ_${this.getTableName(tableOrName)}_${this.joinColumns(columnNames)}`.slice(0, IdentifierLengthLimit);
  }
}
