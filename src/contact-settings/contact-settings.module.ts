
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactSettings } from './entities/contact-settings.entity.js';
import { ContactSettingsService } from './contact-settings.service.js';
import { ContactSettingsController } from './contact-settings.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ContactSettings])],
  controllers: [ContactSettingsController],
  providers: [ContactSettingsService],
  exports: [ContactSettingsService],
})
export class ContactSettingsModule {}
