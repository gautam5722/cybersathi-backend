
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

const REFRESH_COOKIE = 'cybersathi_refresh';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/auth',
  maxAge: COOKIE_MAX_AGE,
};

function readCookie(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined;

  const entry = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return entry ? entry.slice(name.length + 1) : undefined;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: AdminLoginDto,
    @Response({ passthrough: true }) res: any,
  ) {
    const result = await this.authService.login(dto);
    const { refreshToken, ...response } = result;

    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);

    return response;
  }

  @Post('refresh')
  async refresh(
    @Request() req: any,
    @Response({ passthrough: true }) res: any,
  ) {
    const rawToken = readCookie(
      req.headers.cookie,
      REFRESH_COOKIE,
    );

    const result = await this.authService.refreshSession(rawToken ?? '');
    const { refreshToken, ...response } = result;

    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);

    return response;
  }

  @Post('logout')
  async logout(
    @Request() req: any,
    @Response({ passthrough: true }) res: any,
  ) {
    const rawToken = readCookie(
      req.headers.cookie,
      REFRESH_COOKIE,
    );

    await this.authService.logout(rawToken);

    res.clearCookie(REFRESH_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth',
    });

    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req: { user: { id: number } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, dto);
  }
}
