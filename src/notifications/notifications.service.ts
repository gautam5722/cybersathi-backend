
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity.js';

type NotificationDetail = {
    heading: string;
    content: string;
};

type NotificationInput = {
    title?: string;
    message?: string;
    category?: string;
    details?: NotificationDetail[] | null;
};

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) { }

    async create(dto: {
        title: string;
        message: string;
        category?: string;
        details?: NotificationDetail[] | null;
    }) {
        const notification = this.notificationRepository.create({
            title: dto.title,
            message: dto.message,
            category: dto.category ?? 'GENERAL',
            details: dto.details ?? [],
            isPublished: false,
            publishedAt: null,
        });

        const saved = await this.notificationRepository.save(notification);

        return {
            message: 'Notification draft created successfully',
            data: saved,
        };
    }

    async getAll() {
        return this.notificationRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async getPublished() {
        return this.notificationRepository.find({
            where: { isPublished: true },
            order: { publishedAt: 'DESC' },
        });
    }

    async getOne(id: number) {
        const notification = await this.notificationRepository.findOne({
            where: { id, isPublished: true },
        });

        if (!notification) {
            throw new NotFoundException('Published notification not found');
        }

        return notification;
    }

    async update(id: number, body: NotificationInput) {
        const notification = await this.notificationRepository.findOne({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        if (body.title !== undefined) {
            notification.title = body.title;
        }

        if (body.message !== undefined) {
            notification.message = body.message;
        }

        if (body.category !== undefined) {
            notification.category = body.category;
        }

        if (body.details !== undefined) {
            notification.details = body.details;
        }

        const updated = await this.notificationRepository.save(notification);

        return {
            message: 'Notification updated successfully',
            data: updated,
        };
    }

    async publish(id: number) {
        const notification = await this.notificationRepository.findOne({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        notification.isPublished = true;
        notification.publishedAt = new Date();

        await this.notificationRepository.save(notification);

        return {
            message: 'Notification published successfully',
            data: {
                id: notification.id,
                title: notification.title,
                isPublished: notification.isPublished,
                publishedAt: notification.publishedAt,
            },
        };
    }


    async unpublish(id: number) {
        const notification = await this.notificationRepository.findOne({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        notification.isPublished = false;
        notification.publishedAt = null;

        const saved = await this.notificationRepository.save(notification);

        return {
            message: 'Notification unpublished successfully',
            data: {
                id: saved.id,
                title: saved.title,
                isPublished: saved.isPublished,
                publishedAt: saved.publishedAt,
            },
        };
    }


    async delete(id: number) {
        const notification = await this.notificationRepository.findOne({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        await this.notificationRepository.remove(notification);

        return {
            message: 'Notification deleted successfully',
            data: { id },
        };
    }
}
