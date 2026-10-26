import type { QueryRunner } from 'typeorm';

export class CreateAdminsTable1791967420766 {
    name = 'CreateAdminsTable1791967420766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`admins\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(150) NOT NULL, \`passwordHash\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_051db7d37d478a69a7432df147\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_051db7d37d478a69a7432df147\` ON \`admins\``);
        await queryRunner.query(`DROP TABLE \`admins\``);
    }

}
