
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUrl,
  MaxLength,
  IsBoolean,
  IsDateString,
} from 'class-validator';

import { FormCategory } from '../entities/form.entity.js';

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsEnum(FormCategory)
  category: FormCategory;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  department?: string | null;

  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @IsOptional()
  @IsDateString()
  lastDate?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  officialUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
