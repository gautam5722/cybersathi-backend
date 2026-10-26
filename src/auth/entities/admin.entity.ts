
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AdminRole } from '../enums/admin-role.enum.js';


@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: false,
  })
  passwordHash: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;


  @Column({
    type: 'varchar',
    length: 30,
    default: AdminRole.ADMIN,
  })
  role: AdminRole;


  @Column({
    type: 'int',
    default: 0,
  })
  tokenVersion: number;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
