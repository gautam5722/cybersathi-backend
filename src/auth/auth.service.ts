
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'node:crypto';

import { Admin } from './entities/admin.entity.js';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

const REFRESH_TOKEN_DAYS = 30;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    private readonly jwtService: JwtService,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async createAccessToken(admin: Admin): Promise<string> {
    return this.jwtService.signAsync({
      sub: admin.id,
      email: admin.email,
      tokenVersion: admin.tokenVersion,
    });
  }

  private async createRefreshToken(admin: Admin): Promise<string> {
    const rawToken = randomBytes(48).toString('hex');

    const refreshToken = this.refreshTokenRepository.create({
      tokenHash: this.hashToken(rawToken),
      adminId: admin.id,
      expiresAt: new Date(
        Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
      ),
      revokedAt: null,
    });

    await this.refreshTokenRepository.save(refreshToken);
    return rawToken;
  }

  async createInitialAdmin(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingAdmin = await this.adminRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = this.adminRepository.create({
      email: normalizedEmail,
      passwordHash,
    });

    const savedAdmin = await this.adminRepository.save(admin);

    return {
      id: savedAdmin.id,
      email: savedAdmin.email,
      message: 'Initial admin created successfully',
    };
  }

  async login(dto: AdminLoginDto) {
    const email = dto.email.trim().toLowerCase();

    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .addSelect('admin.passwordHash')
      .where('admin.email = :email', { email })
      .andWhere('admin.isActive = :isActive', { isActive: true })
      .getOne();

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.createAccessToken(admin);
    const refreshToken = await this.createRefreshToken(admin);

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: '15m',
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }

  async refreshSession(rawToken: string) {
    if (!rawToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const storedToken = await this.refreshTokenRepository.findOne({
      where: {
        tokenHash: this.hashToken(rawToken),
        revokedAt: IsNull(),
      },
    });

    if (!storedToken || storedToken.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Session expired. Please log in again');
    }

    const admin = await this.adminRepository.findOne({
      where: {
        id: storedToken.adminId,
        isActive: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin is inactive or no longer exists');
    }

    // Rotate the old refresh token so it cannot be reused.
    storedToken.revokedAt = new Date();
    await this.refreshTokenRepository.save(storedToken);

    const accessToken = await this.createAccessToken(admin);
    const refreshToken = await this.createRefreshToken(admin);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: '15m',
    };
  }

  async logout(rawToken?: string) {
    if (rawToken) {
      const storedToken = await this.refreshTokenRepository.findOne({
        where: {
          tokenHash: this.hashToken(rawToken),
          revokedAt: IsNull(),
        },
      });

      if (storedToken) {
        storedToken.revokedAt = new Date();
        await this.refreshTokenRepository.save(storedToken);
      }
    }

    return { message: 'Logout successful' };
  }

  async changePassword(adminId: number, dto: ChangePasswordDto) {
    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .addSelect('admin.passwordHash')
      .where('admin.id = :id', { id: adminId })
      .andWhere('admin.isActive = :isActive', { isActive: true })
      .getOne();

    if (!admin) {
      throw new UnauthorizedException('Admin not found or inactive');
    }

    const passwordMatches = await bcrypt.compare(
      dto.currentPassword,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new UnauthorizedException(
        'New password must be different from current password',
      );
    }

    admin.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    admin.tokenVersion += 1;

    await this.adminRepository.save(admin);

    // Revoke every refresh token belonging to this admin.
    await this.refreshTokenRepository.update(
      { adminId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );

    return { message: 'Password changed successfully' };
  }
}
