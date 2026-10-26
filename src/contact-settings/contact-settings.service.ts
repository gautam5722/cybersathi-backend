
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSettings } from './entities/contact-settings.entity.js';

export type ContactLink = {
  heading: string;
  url: string;
};

export type UpdateContactSettingsDto = {
  address?: string | null;
  googleMapsUrl?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  telegram?: string | null;
  socialLinks?: ContactLink[] | null;
  customLinks?: ContactLink[] | null;
};

@Injectable()
export class ContactSettingsService {
  constructor(
    @InjectRepository(ContactSettings)
    private readonly repository: Repository<ContactSettings>,
  ) {}

  async getPublicSettings() {
    const settings = await this.repository.findOne({
      where: { id: 1 },
    });

    return settings ?? {
      id: 1,
      address: null,
      googleMapsUrl: null,
      phone: null,
      whatsapp: null,
      telegram: null,
      socialLinks: [],
      customLinks: [],
    };
  }

  async updateSettings(dto: UpdateContactSettingsDto) {
    let settings = await this.repository.findOne({
      where: { id: 1 },
    });

    if (!settings) {
      settings = this.repository.create({ id: 1 });
    }

    if (dto.address !== undefined) settings.address = dto.address;
    if (dto.googleMapsUrl !== undefined) settings.googleMapsUrl = dto.googleMapsUrl;
    if (dto.phone !== undefined) settings.phone = dto.phone;
    if (dto.whatsapp !== undefined) settings.whatsapp = dto.whatsapp;
    if (dto.telegram !== undefined) settings.telegram = dto.telegram;
    if (dto.socialLinks !== undefined) settings.socialLinks = dto.socialLinks;
    if (dto.customLinks !== undefined) settings.customLinks = dto.customLinks;

    const saved = await this.repository.save(settings);

    return {
      message: 'Contact settings saved successfully',
      data: saved,
    };
  }
}
