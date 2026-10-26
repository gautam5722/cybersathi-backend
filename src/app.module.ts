
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FormsModule } from './forms/forms.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AdminModule } from './admin/admin.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { ContactSettingsModule } from './contact-settings/contact-settings.module.js';
import { readFileSync } from 'node:fs';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY || 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET || 'YOUR_APP_SECRET',
      serviceId: 'cybersathi-backend',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_DATABASE', 'cybersathi_db'),
        ssl: {
          ca: readFileSync(
            new URL('../certs/aiven-ca.pem', import.meta.url),
            'utf8',
          ),
          rejectUnauthorized: true,
        },
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    FormsModule,
    AdminModule,
    AuthModule,
    NotificationsModule,
    ContactSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
