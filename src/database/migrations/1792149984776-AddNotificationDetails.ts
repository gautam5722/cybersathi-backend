import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationDetails1792149984776 implements MigrationInterface {
    name = 'AddNotificationDetails1792149984776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`details\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`details\``);
    }

}
