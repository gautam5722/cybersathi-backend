
import type { QueryRunner } from 'typeorm';

export class AddAdminTokenVersion1792053525201 {
  name = 'AddAdminTokenVersion1792053525201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`admins\`
       ADD \`tokenVersion\` int NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`admins\`
       DROP COLUMN \`tokenVersion\``,
    );
  }
}
