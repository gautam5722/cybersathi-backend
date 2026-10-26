import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotifications1792066702539 implements MigrationInterface {
    name = 'CreateNotifications1792066702539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(200) NOT NULL, \`message\` text NOT NULL, \`category\` varchar(30) NOT NULL DEFAULT 'GENERAL', \`isPublished\` tinyint NOT NULL DEFAULT 0, \`publishedAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`notifications\``);
    }

}
