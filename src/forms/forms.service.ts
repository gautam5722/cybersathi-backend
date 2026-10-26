
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Form } from './entities/form.entity.js';
import { QueryFormDto } from './dto/query-form.dto.js';
import { CreateFormDto } from './dto/create-form.dto.js';
import { UpdateFormDto } from './dto/update-form.dto.js';

@Injectable()
export class FormsService {
    constructor(
        @InjectRepository(Form)
        private readonly formRepository: Repository<Form>,
    ) { }

    // Get published forms with search, filter and pagination
    async findPublishedForms(query: QueryFormDto) {
        const {
            search,
            category,
            page = 1,
            limit = 10,
        } = query;

        const queryBuilder = this.formRepository
            .createQueryBuilder('form')
            .where('form.isPublished = :published', {
                published: true,
            });

        // Search by title or description
        if (search?.trim()) {
            queryBuilder.andWhere(
                '(form.title LIKE :search OR form.description LIKE :search)',
                { search: `%${search.trim()}%` },
            );
        }

        // Filter by category
        if (category) {
            queryBuilder.andWhere(
                'form.category = :category',
                { category },
            );
        }

        // Pagination and total count
        const [forms, total] = await queryBuilder
            .orderBy('form.createdAt', 'DESC')
            .addOrderBy('form.id', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            data: forms,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Create a new form
    async createForm(data: CreateFormDto): Promise<Form> {
        const form = this.formRepository.create(data);
        return this.formRepository.save(form);
    }


    async updateForm(id: number, data: UpdateFormDto): Promise<Form> {
        const form = await this.formRepository.findOne({
            where: { id },
        });

        if (!form) {
            throw new NotFoundException(`Form with ID ${id} not found`);
        }

        Object.assign(form, data);

        return this.formRepository.save(form);
    }


    async deleteForm(id: number) {
        const form = await this.formRepository.findOne({
            where: { id },
        });

        if (!form) {
            throw new NotFoundException(`Form with ID ${id} not found`);
        }

        await this.formRepository.remove(form);

        return {
            message: 'Form deleted successfully',
            id,
        };
    }



    async findAllFormsForAdmin(query: QueryFormDto) {
        const { search, category, page = 1, limit = 10 } = query;

        const qb = this.formRepository.createQueryBuilder('form');

        if (search?.trim()) {
            qb.andWhere(
                '(form.title LIKE :search OR form.description LIKE :search)',
                { search: `%${search.trim()}%` },
            );
        }

        if (category) {
            qb.andWhere('form.category = :category', { category });
        }

        const [forms, total] = await qb
            .orderBy('form.createdAt', 'DESC')
            .addOrderBy('form.id', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            data: forms,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

}
