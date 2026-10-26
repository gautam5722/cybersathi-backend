
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FormCategory {
  GOVERNMENT_JOB = 'government_job',
  COMPETITIVE_EXAM = 'competitive_exam',
  ADMISSION = 'admission',
  SCHOLARSHIP = 'scholarship',
  ADMIT_CARD = 'admit_card',
  RESULT = 'result',
}

@Entity('forms')
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({
    type: 'enum',
    enum: FormCategory,
  })
  category: FormCategory;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  department: string | null;

  @Column({ type: 'date', nullable: true })
  startDate: string | null;

  @Column({ type: 'date', nullable: true })
  lastDate: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  officialUrl: string | null;


  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
