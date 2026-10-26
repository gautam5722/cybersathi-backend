
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsDateString,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity.js';

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminRemarks?: string;

 @IsOptional()
@Matches(/^\d{4}-\d{2}-\d{2}$/)
@IsDateString({ strict: true })
appointmentDate?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  appointmentTime?: string;
}
