
import {
    Controller,
    Get,
    Req,
    UseGuards, Patch, Param, Body, ParseIntPipe,
    UnauthorizedException,
    Post,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UpdateAdminStatusDto } from './dto/update-admin-status.dto.js';

import { Roles } from '../auth/decorators/roles.decorator.js';
import { AdminRole } from '../auth/enums/admin-role.enum.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ResetAdminPasswordDto } from './dto/reset-admin-password.dto.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('profile')
    async getProfile(@Req() req: Request) {
        const user = req.user as { id?: number; sub?: number } | undefined;
        const adminId = user?.id ?? user?.sub;

        if (!adminId) {
            throw new UnauthorizedException('Admin identity not found in token');
        }

        return this.adminService.getProfile(Number(adminId));
    }


    @Roles(AdminRole.SUPER_ADMIN)
    @UseGuards(RolesGuard)
    @Get()
    async getAllAdmins() {
        return this.adminService.getAllAdmins();
    }

    @Patch(':id/status')

    @Roles(AdminRole.SUPER_ADMIN)
    @UseGuards(RolesGuard)
    async updateAdminStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateAdminStatusDto,
        @Req() req: Request,

    ) {
        const user = req.user as { id?: number } | undefined;

        return this.adminService.updateAdminStatus(
            id,
            body.isActive,
            Number(user?.id),
        );
    }


    @Patch(':id/reset-password')
    @UseGuards(RolesGuard)
    @Roles(AdminRole.SUPER_ADMIN)
    async resetAdminPassword(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ResetAdminPasswordDto,
    ) {
        return this.adminService.resetAdminPassword(id, dto);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(AdminRole.SUPER_ADMIN)
    async createAdmin(@Body() dto: CreateAdminDto) {
        return this.adminService.createAdmin(dto);
    }


}
