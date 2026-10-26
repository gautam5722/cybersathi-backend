
import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { ContactSettingsService } from './contact-settings.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AdminRole } from '../auth/enums/admin-role.enum.js';
import { Public } from '../auth/decorators/public.decorator.js';

@Controller('contact-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContactSettingsController {
  constructor(
    private readonly contactSettingsService: ContactSettingsService,
  ) {}

  @Public()
  @Get()
  async getPublicSettings() {
    return this.contactSettingsService.getPublicSettings();
  }

  @Patch()
  @Roles(AdminRole.SUPER_ADMIN)
  async updateSettings(
    @Body()
    body: {
      address?: string | null;
      googleMapsUrl?: string | null;
      phone?: string | null;
      whatsapp?: string | null;
      telegram?: string | null;
      socialLinks?: { heading: string; url: string }[] | null;
      customLinks?: { heading: string; url: string }[] | null;
    },
  ) {
    return this.contactSettingsService.updateSettings(body);
  }
}
