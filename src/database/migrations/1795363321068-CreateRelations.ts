import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRelations1795363321068 implements MigrationInterface {
    name = 'CreateRelations1795363321068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "collections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "season" character varying(50) NOT NULL, CONSTRAINT "PK_21c00b1ebbd41ba1354242c5c4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "materials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "percentage" integer, CONSTRAINT "UQ_9b614bb357c5d8741a1a381385c" UNIQUE ("name"), CONSTRAINT "PK_2fd1a93ecb222a28bef28663fa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clothing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(150) NOT NULL, "price" numeric(10,2) NOT NULL, "size" character varying(20) NOT NULL, "color" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "collection_id" uuid, CONSTRAINT "PK_43489b6750d2a415a2f8254e757" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clothing_materials" ("clothing_id" uuid NOT NULL, "material_id" uuid NOT NULL, CONSTRAINT "PK_3c56a3342bcf00034fa7cb16a75" PRIMARY KEY ("clothing_id", "material_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cef3ff8b54e3be7d04ab3dfdba" ON "clothing_materials"  ("clothing_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_01f941b1af05aae4560dc8e77a" ON "clothing_materials"  ("material_id") `);
        await queryRunner.query(`ALTER TABLE "clothing" ADD CONSTRAINT "FK_bc9d654084555ab9cdc7a4e7a44" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clothing_materials" ADD CONSTRAINT "FK_cef3ff8b54e3be7d04ab3dfdba2" FOREIGN KEY ("clothing_id") REFERENCES "clothing"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "clothing_materials" ADD CONSTRAINT "FK_01f941b1af05aae4560dc8e77a1" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clothing_materials" DROP CONSTRAINT "FK_01f941b1af05aae4560dc8e77a1"`);
        await queryRunner.query(`ALTER TABLE "clothing_materials" DROP CONSTRAINT "FK_cef3ff8b54e3be7d04ab3dfdba2"`);
        await queryRunner.query(`ALTER TABLE "clothing" DROP CONSTRAINT "FK_bc9d654084555ab9cdc7a4e7a44"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01f941b1af05aae4560dc8e77a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cef3ff8b54e3be7d04ab3dfdba"`);
        await queryRunner.query(`DROP TABLE "clothing_materials"`);
        await queryRunner.query(`DROP TABLE "clothing"`);
        await queryRunner.query(`DROP TABLE "materials"`);
        await queryRunner.query(`DROP TABLE "collections"`);
    }

}
