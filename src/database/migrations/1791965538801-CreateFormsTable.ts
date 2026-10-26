
import type { QueryRunner } from 'typeorm';

export class CreateFormsTable1791965538801 {
  name = 'CreateFormsTable1791965538801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`forms\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(200) NOT NULL,
        \`category\` enum(
          'government_job',
          'competitive_exam',
          'admission',
          'scholarship',
          'admit_card',
          'result'
        ) NOT NULL,
        \`description\` text NOT NULL,
        \`department\` varchar(255) NULL,
        \`startDate\` date NULL,
        \`lastDate\` date NULL,
        \`officialUrl\` varchar(500) NULL,
        \`isPublished\` tinyint NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
          ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `forms`');
  }
}
