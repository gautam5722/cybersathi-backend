
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contact_settings')
export class ContactSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ type: 'text', nullable: true })
  googleMapsUrl: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  whatsapp: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  telegram: string | null;

  @Column({ type: 'json', nullable: true })
  socialLinks: {
    heading: string;
    url: string;
  }[] | null;

  @Column({ type: 'json', nullable: true })
  customLinks: {
    heading: string;
    url: string;
  }[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
