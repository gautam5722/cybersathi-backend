
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDateString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customerName: string;

  @IsString()
  @Matches(/^[0-9]{10,15}$/)
  phone: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  serviceName: string;

@Matches(/^\d{4}-\d{2}-\d{2}$/)
@IsDateString({ strict: true })
appointmentDate: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  appointmentTime: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
