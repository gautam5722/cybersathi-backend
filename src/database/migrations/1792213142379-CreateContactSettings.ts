
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactSettings1792213142379
  implements MigrationInterface
{
  name = 'CreateContactSettings1792213142379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`contact_settings\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`address\` varchar(255) NULL,
        \`googleMapsUrl\` text NULL,
        \`phone\` varchar(30) NULL,
        \`whatsapp\` varchar(30) NULL,
        \`telegram\` varchar(255) NULL,
        \`socialLinks\` json NULL,
        \`customLinks\` json NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `contact_settings`');
  }
}
