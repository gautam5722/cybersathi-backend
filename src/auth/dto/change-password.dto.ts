
import {
    IsString,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @MinLength(12, {
        message: 'Current password must be at least 12 characters long',
    })
    @MaxLength(72, {
        message: 'Current password must not exceed 72 characters',
    })
    currentPassword: string;

    @IsString()
    @MinLength(12, {
        message: 'New password must be at least 12 characters long',
    })
    @MaxLength(72, {
        message: 'New password must not exceed 72 characters',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
        message:
            'New password must contain uppercase, lowercase, number, and special character',
    })
    newPassword: string;
}
