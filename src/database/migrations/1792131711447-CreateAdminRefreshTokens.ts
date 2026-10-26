import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdminRefreshTokens1792131711447 implements MigrationInterface {
    name = 'CreateAdminRefreshTokens1792131711447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`admin_refresh_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tokenHash\` varchar(255) NOT NULL, \`adminId\` int NOT NULL, \`expiresAt\` datetime NOT NULL, \`revokedAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_edd32560dd4bb5392ad531a69b\` (\`tokenHash\`), INDEX \`IDX_9a2e8e4c20062acd77e11b2757\` (\`adminId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`admin_refresh_tokens\` ADD CONSTRAINT \`FK_9a2e8e4c20062acd77e11b27577\` FOREIGN KEY (\`adminId\`) REFERENCES \`admins\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admin_refresh_tokens\` DROP FOREIGN KEY \`FK_9a2e8e4c20062acd77e11b27577\``);
        await queryRunner.query(`DROP INDEX \`IDX_9a2e8e4c20062acd77e11b2757\` ON \`admin_refresh_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_edd32560dd4bb5392ad531a69b\` ON \`admin_refresh_tokens\``);
        await queryRunner.query(`DROP TABLE \`admin_refresh_tokens\``);
    }

}
