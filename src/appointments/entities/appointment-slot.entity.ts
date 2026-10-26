
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
} from 'typeorm';

@Entity('appointment_slots')
@Unique('UQ_appointment_slot_key', [
    'serviceName',
    'appointmentDate',
    'appointmentTime',
])
export class AppointmentSlot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 200 })
    serviceName: string;

    @Column({ type: 'date' })
    appointmentDate: string;

    @Column({ type: 'varchar', length: 10 })
    appointmentTime: string;

    @CreateDateColumn()
    createdAt: Date;
}
