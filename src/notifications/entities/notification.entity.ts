import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 200 })
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({
        type: 'varchar',
        length: 30,
        default: 'GENERAL',
    })
    category: string;

    @Column({ type: 'boolean', default: false })
    isPublished: boolean;

    @Column({ type: 'datetime', nullable: true })
    publishedAt: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'json', nullable: true })
    details: {
        heading: string;
        content: string;
    }[] | null;
}