
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity.js';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy.js';
import { AppointmentsModule } from '../appointments/appointments.module.js';
import { RolesGuard } from './guards/roles.guard.js';
import { RefreshToken } from './entities/refresh-token.entity.js';

@Module({
imports: [
  ConfigModule,
  TypeOrmModule.forFeature([Admin, RefreshToken]),
  AppointmentsModule,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.getOrThrow<string>('JWT_SECRET'),
      signOptions: { expiresIn: '15m' },
    }),
  }),
],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
