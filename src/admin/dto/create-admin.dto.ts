import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';

export class CreateAdminDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(12)
    @MaxLength(72)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        {
            message:
                'Password must contain uppercase, lowercase, number and special character',
        },
    )
    password: string;
}