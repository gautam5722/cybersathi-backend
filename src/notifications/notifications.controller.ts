
import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    ParseIntPipe,
    Body,
    UseGuards,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AdminRole } from '../auth/enums/admin-role.enum.js';
import { Public } from '../auth/decorators/public.decorator.js';

type NotificationDetail = {
    heading: string;
    content: string;
};

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
    ) { }

    @Post()
    @Roles(AdminRole.SUPER_ADMIN)
    async create(
        @Body()
        body: {
            title: string;
            message: string;
            category?: string;
            details?: NotificationDetail[] | null;
        },
    ) {
        return this.notificationsService.create(body);
    }

    @Get()
    @Roles(AdminRole.SUPER_ADMIN)
    async getAll() {
        return this.notificationsService.getAll();
    }

    @Public()
    @Get('published')
    async getPublished() {
        return this.notificationsService.getPublished();
    }

    @Public()
    @Get('published/:id')
    async getPublishedOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.notificationsService.getOne(id);
    }

    @Patch(':id')
    @Roles(AdminRole.SUPER_ADMIN)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        body: {
            title?: string;
            message?: string;
            category?: string;
            details?: NotificationDetail[] | null;
        },
    ) {
        return this.notificationsService.update(id, body);
    }

    @Patch(':id/publish')
    @Roles(AdminRole.SUPER_ADMIN)
    async publish(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.notificationsService.publish(id);
    }

    @Patch(':id/unpublish')
    @Roles(AdminRole.SUPER_ADMIN)
    async unpublish(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.notificationsService.unpublish(id);
    }

    @Delete(':id')
    @Roles(AdminRole.SUPER_ADMIN)
    async delete(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.notificationsService.delete(id);
    }
}
