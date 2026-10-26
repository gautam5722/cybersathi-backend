
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }


  async validate(payload: {
    sub: number;
    email: string;
    tokenVersion: number;
  }) {
    if (
      !payload.sub ||
      !payload.email ||
      payload.tokenVersion === undefined
    ) {
      throw new UnauthorizedException();
    }

    const admin = await this.adminRepository.findOne({
      where: {
        id: payload.sub,
        email: payload.email,
        isActive: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException(
        'Admin is inactive or no longer exists',
      );
    }

    if (payload.tokenVersion !== admin.tokenVersion) {
      throw new UnauthorizedException(
        'Session expired. Please log in again',
      );
    }

    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
  }

}
