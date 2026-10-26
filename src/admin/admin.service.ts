
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../auth/entities/admin.entity.js';
import * as bcrypt from 'bcrypt';
import { ResetAdminPasswordDto } from './dto/reset-admin-password.dto.js';
import { AdminRole } from '../auth/enums/admin-role.enum.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
    ) { }

    async getProfile(id: number) {
        const admin = await this.adminRepository.findOne({
            where: { id },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        return {
            id: admin.id,
            email: admin.email,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
            role: admin.role,
        };
    }


    async getAllAdmins() {
        const admins = await this.adminRepository.find({
            select: {
                id: true,
                email: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
            order: {
                id: 'ASC',
            },
        });

        return {
            message: 'Admins fetched successfully',
            data: admins,
        };
    }



    async updateAdminStatus(
        id: number,
        isActive: boolean,
        currentAdminId: number,
    ) {
        if (id === currentAdminId) {
            throw new BadRequestException(
                'You cannot change your own admin status',
            );
        }

        const admin = await this.adminRepository.findOne({
            where: { id },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        admin.isActive = isActive;

        const updatedAdmin = await this.adminRepository.save(admin);

        return {
            message: 'Admin status updated successfully',
            data: {
                id: updatedAdmin.id,
                email: updatedAdmin.email,
                isActive: updatedAdmin.isActive,
                updatedAt: updatedAdmin.updatedAt,
            },
        };
    }


    async resetAdminPassword(
        id: number,
        dto: ResetAdminPasswordDto,
    ) {
        const admin = await this.adminRepository.findOne({
            where: { id },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        admin.passwordHash = await bcrypt.hash(dto.newPassword, 12);
        admin.tokenVersion = admin.tokenVersion + 1;

        await this.adminRepository.save(admin);

        return {
            message: 'Admin password reset successfully',
            adminId: admin.id,
        };
    }

    async createAdmin(dto: CreateAdminDto) {
    const existingAdmin = await this.adminRepository.findOne({
        where: { email: dto.email },
    });

    if (existingAdmin) {
        throw new ConflictException(
            'An admin with this email already exists',
        );
    }

    const admin = this.adminRepository.create({
        email: dto.email,
        passwordHash: await bcrypt.hash(dto.password, 12),
        role: AdminRole.ADMIN,
        isActive: true,
    });

    const savedAdmin = await this.adminRepository.save(admin);

    return {
        message: 'Admin created successfully',
        data: {
            id: savedAdmin.id,
            email: savedAdmin.email,
            role: savedAdmin.role,
            isActive: savedAdmin.isActive,
            createdAt: savedAdmin.createdAt,
        },
    };
}


}
