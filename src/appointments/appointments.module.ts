
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity.js';
import { AppointmentsService } from './appointments.service.js';
import { AppointmentsController } from './appointments.controller.js';
import { AppointmentSlot } from './entities/appointment-slot.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, AppointmentSlot])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
