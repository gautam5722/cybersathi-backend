
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus, } from './entities/appointment.entity.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { QueryAppointmentsDto } from './dto/query-appointments.dto.js';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto.js';
import { DataSource } from 'typeorm';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>,
        private readonly dataSource: DataSource,
    ) { }





    async createAppointment(data: CreateAppointmentDto) {
        // Step 1: Validate date and time
        const now = new Date();

        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const appointmentDate = new Date(
            `${data.appointmentDate}T00:00:00`,
        );

        if (appointmentDate < today) {
            throw new BadRequestException(
                'Appointment date cannot be in the past',
            );
        }

        const [hours, minutes] = data.appointmentTime
            .split(':')
            .map(Number);

        const appointmentDateTime = new Date(
            `${data.appointmentDate}T00:00:00`,
        );

        appointmentDateTime.setHours(hours, minutes, 0, 0);

        if (appointmentDateTime <= now) {
            throw new BadRequestException(
                'Appointment time must be in the future',
            );
        }

        // Step 2: Coordinate concurrent requests using a transaction
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Insert the slot key. The unique index serializes
            // concurrent attempts for the same service/date/time.
            await queryRunner.query(
                `INSERT INTO appointment_slots
                (serviceName, appointmentDate, appointmentTime)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
                [
                    data.serviceName,
                    data.appointmentDate,
                    data.appointmentTime,
                ],
            );

            // Check whether an active appointment already owns the slot
            const existingAppointment = await queryRunner.manager
                .createQueryBuilder(Appointment, 'appointment')
                .where('appointment.appointmentDate = :date', {
                    date: data.appointmentDate,
                })
                .andWhere('appointment.appointmentTime = :time', {
                    time: data.appointmentTime,
                })
                .andWhere('appointment.serviceName = :serviceName', {
                    serviceName: data.serviceName,
                })
                .andWhere('appointment.status IN (:...statuses)', {
                    statuses: [
                        AppointmentStatus.PENDING,
                        AppointmentStatus.APPROVED,
                        AppointmentStatus.RESCHEDULED,
                    ],
                })
                .getOne();

            if (existingAppointment) {
                throw new BadRequestException(
                    'This appointment slot is already booked. Please choose another time.',
                );
            }

            // Step 3: Save the appointment in the same transaction
            const appointment = queryRunner.manager.create(Appointment, {
                ...data,
                status: AppointmentStatus.PENDING,
            });

            const savedAppointment =
                await queryRunner.manager.save(Appointment, appointment);

            await queryRunner.commitTransaction();

            return {
                message: 'Appointment request submitted successfully',
                data: savedAppointment,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }




    async findAllForAdmin(query: QueryAppointmentsDto) {
        const { status, page = 1, limit = 10 } = query;

        const qb = this.appointmentRepository
            .createQueryBuilder('appointment');

        if (status) {
            qb.andWhere('appointment.status = :status', { status });
        }

        const [appointments, total] = await qb
            .orderBy('appointment.createdAt', 'DESC')
            .addOrderBy('appointment.id', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            data: appointments,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }



    async updateAppointmentStatus(
        id: number,
        data: UpdateAppointmentStatusDto,
    ) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const appointment = await queryRunner.manager.findOne(
                Appointment,
                { where: { id }, lock: { mode: 'pessimistic_write' } },
            );

            if (!appointment) {
                throw new NotFoundException(
                    `Appointment with ID ${id} not found`,
                );
            }

            const activeStatuses = [
                AppointmentStatus.PENDING,
                AppointmentStatus.APPROVED,
                AppointmentStatus.RESCHEDULED,
            ];

            const isRescheduling =
                data.status === AppointmentStatus.RESCHEDULED;

            const newDate = isRescheduling
                ? data.appointmentDate
                : appointment.appointmentDate;

            const newTime = isRescheduling
                ? data.appointmentTime
                : appointment.appointmentTime;

            if (isRescheduling && (!newDate || !newTime)) {
                throw new BadRequestException(
                    'New appointment date and time are required for rescheduling',
                );
            }

            if (activeStatuses.includes(data.status)) {
                const now = new Date();
                const requestedDate = new Date(`${newDate}T00:00:00`);

                const today = new Date(now);
                today.setHours(0, 0, 0, 0);

                if (requestedDate < today) {
                    throw new BadRequestException(
                        'Appointment date cannot be in the past',
                    );
                }

                if (isRescheduling) {
                    const [hours, minutes] = newTime!.split(':').map(Number);
                    const requestedDateTime = new Date(`${newDate}T00:00:00`);
                    requestedDateTime.setHours(hours, minutes, 0, 0);

                    if (requestedDateTime <= now) {
                        throw new BadRequestException(
                            'Appointment time must be in the future',
                        );
                    }
                }

                // Coordinate access to this slot using its unique key.
                await queryRunner.query(
                    `INSERT INTO appointment_slots
                    (serviceName, appointmentDate, appointmentTime)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
                    [appointment.serviceName, newDate, newTime],
                );

                const existingAppointment = await queryRunner.manager
                    .createQueryBuilder(Appointment, 'appointment')
                    .where('appointment.appointmentDate = :date', {
                        date: newDate,
                    })
                    .andWhere('appointment.appointmentTime = :time', {
                        time: newTime,
                    })
                    .andWhere('appointment.serviceName = :serviceName', {
                        serviceName: appointment.serviceName,
                    })
                    .andWhere('appointment.id != :id', {
                        id: appointment.id,
                    })
                    .andWhere('appointment.status IN (:...statuses)', {
                        statuses: activeStatuses,
                    })
                    .getOne();

                if (existingAppointment) {
                    throw new BadRequestException(
                        'This appointment slot is already booked. Please choose another time.',
                    );
                }
            }

            if (isRescheduling) {
                appointment.appointmentDate = newDate!;
                appointment.appointmentTime = newTime!;
            }

            appointment.status = data.status;

            if (data.adminRemarks !== undefined) {
                appointment.adminRemarks = data.adminRemarks;
            }

            const savedAppointment = await queryRunner.manager.save(
                Appointment,
                appointment,
            );

            await queryRunner.commitTransaction();

            return {
                message: 'Appointment status updated successfully',
                data: savedAppointment,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }





}
