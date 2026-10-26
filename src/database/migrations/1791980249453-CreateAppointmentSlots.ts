
import type { QueryRunner } from 'typeorm';

export class CreateAppointmentSlots1791980249453 {
    name = 'CreateAppointmentSlots1791980249453';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`appointment_slots\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`serviceName\` varchar(200) NOT NULL,
                \`appointmentDate\` date NOT NULL,
                \`appointmentTime\` varchar(10) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`UQ_appointment_slot_key\`
                    (\`serviceName\`, \`appointmentDate\`, \`appointmentTime\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DROP TABLE `appointment_slots`',
        );
    }
}
