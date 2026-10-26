
import type { QueryRunner } from 'typeorm';

export class AddAdminRole1792044822344 {
    name = 'AddAdminRole1792044822344';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`admins\`
             ADD \`role\` varchar(30) NOT NULL DEFAULT 'ADMIN'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`admins\` DROP COLUMN \`role\``,
        );
    }
}
