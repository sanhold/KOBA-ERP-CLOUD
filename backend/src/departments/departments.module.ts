import { Module } from '@nestjs/common';
import { DepartmentsService } from './services/departments.service';
import { DepartmentsController } from './controllers/departments.controller';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
