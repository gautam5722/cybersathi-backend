
import { Controller, Post, Body, UseGuards, Get, Query, Patch, ParseIntPipe, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { QueryAppointmentsDto } from './dto/query-appointments.dto.js';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto.js';

@Controller('appointments')
export class AppointmentsController {
    constructor(
        private readonly appointmentsService: AppointmentsService,
    ) { }

    @Post()
    async createAppointment(@Body() body: CreateAppointmentDto) {
        return this.appointmentsService.createAppointment(body);
    }


    @UseGuards(JwtAuthGuard)
    @Get('admin')
    async findAllForAdmin(
        @Query() query: QueryAppointmentsDto,
    ) {
        return this.appointmentsService.findAllForAdmin(query);
    }


    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    async updateAppointmentStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateAppointmentStatusDto,
    ) {
        return this.appointmentsService.updateAppointmentStatus(id, body);
    }

}
