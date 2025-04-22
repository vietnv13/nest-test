import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1001745234673399 implements MigrationInterface {
  name = 'Version1001745234673399';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "locations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "building" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "number" character varying(255) NOT NULL, "area" character varying(255), "mpath" character varying DEFAULT '', "parentId" integer, CONSTRAINT "PK_locations_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_locations_building" ON "locations" ("building") `);
    await queryRunner.query(`CREATE INDEX "IDX_locations_number" ON "locations" ("number") `);
    await queryRunner.query(
      `ALTER TABLE "locations" ADD CONSTRAINT "FK_locations_parentId_locations_id" FOREIGN KEY ("parentId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_locations_parentId_locations_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_locations_number"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_locations_building"`);
    await queryRunner.query(`DROP TABLE "locations"`);
  }
}
