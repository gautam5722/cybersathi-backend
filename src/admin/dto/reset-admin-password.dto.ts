
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class ResetAdminPasswordDto {
  @IsString()
  @MinLength(12, {
    message: 'Password must be at least 12 characters long',
  })
  @MaxLength(72, {
    message: 'Password must not exceed 72 characters',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  newPassword: string;
}
