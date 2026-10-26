
import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Form } from '../forms/entities/form.entity.js';
import { Admin } from '../auth/entities/admin.entity.js';
import { RefreshToken } from '../auth/entities/refresh-token.entity.js';
import { Appointment } from '../appointments/entities/appointment.entity.js';
import { AppointmentSlot } from '../appointments/entities/appointment-slot.entity.js';
import { Notification } from '../notifications/entities/notification.entity.js';
import { ContactSettings } from '../contact-settings/entities/contact-settings.entity.js';


export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'cybersathi_db',
  entities: [
    Form,
    Admin,
    RefreshToken,
    Appointment,
    AppointmentSlot,
    Notification,
    ContactSettings,

  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
