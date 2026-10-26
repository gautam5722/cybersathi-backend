
import { Controller, Get, Post, Body, Delete, Query, Patch, ParseIntPipe, Param } from '@nestjs/common';
import { FormsService } from './forms.service.js';
import { Form } from './entities/form.entity.js';
import { CreateFormDto } from './dto/create-form.dto.js';
import { QueryFormDto } from './dto/query-form.dto.js';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

import { UpdateFormDto } from './dto/update-form.dto.js';

@Controller('forms')
export class FormsController {
    constructor(
        private readonly formsService: FormsService,
    ) { }

    @Get()
    async getPublishedForms(
        @Query() query: QueryFormDto,
    ) {
        return this.formsService.findPublishedForms(query);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createForm(
        @Body() body: CreateFormDto,
    ): Promise<Form> {
        return this.formsService.createForm(body);
    }


    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateForm(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateFormDto,
    ): Promise<Form> {
        return this.formsService.updateForm(id, body);
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteForm(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.formsService.deleteForm(id);
    }


    @UseGuards(JwtAuthGuard)
    @Get('admin')
    async getAllFormsForAdmin(@Query() query: QueryFormDto) {
        return this.formsService.findAllFormsForAdmin(query);
    }

}
