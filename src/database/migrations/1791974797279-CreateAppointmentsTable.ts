import type { QueryRunner } from 'typeorm';

export class CreateAppointmentsTable1791974797279  {
    name = 'CreateAppointmentsTable1791974797279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`appointments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`customerName\` varchar(150) NOT NULL, \`phone\` varchar(20) NOT NULL, \`email\` varchar(150) NULL, \`serviceName\` varchar(200) NOT NULL, \`appointmentDate\` date NOT NULL, \`appointmentTime\` varchar(10) NOT NULL, \`notes\` text NULL, \`status\` enum ('pending', 'approved', 'rejected', 'rescheduled') NOT NULL DEFAULT 'pending', \`adminRemarks\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`appointments\``);
    }

}
