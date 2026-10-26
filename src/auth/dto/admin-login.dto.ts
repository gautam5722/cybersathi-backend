
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;
}
