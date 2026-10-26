import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller.js';
import { FormsService } from './forms.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entities/form.entity.js';


@Module({
  imports: [TypeOrmModule.forFeature([Form])],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule { }
