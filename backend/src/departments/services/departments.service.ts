import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { AuditAction } from '@prisma/client';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(tenantId: string, dto: CreateDepartmentDto, userId?: string) {
    const existing = await this.prisma.departments.findUnique({
      where: {
        branchId_code: {
          branchId: dto.branchId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Le département avec le code '${dto.code}' existe déjà dans cette agence`);
    }

    const department = await this.prisma.departments.create({
      data: {
        tenantId,
        branchId: dto.branchId,
        name: dto.name,
        code: dto.code.toUpperCase(),
        managerId: dto.managerId,
      },
    });

    await this.auditService.logAction({
      tenantId,
      userId,
      action: AuditAction.CREATE,
      tableName: 'departments',
      recordId: department.id,
      newValues: { name: department.name, code: department.code },
    });

    return department;
  }

  async findAllByTenant(tenantId: string) {
    return this.prisma.departments.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const department = await this.prisma.departments.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Département introuvable (ID: ${id})`);
    }

    return department;
  }

  async update(id: string, tenantId: string, dto: UpdateDepartmentDto, userId?: string) {
    const department = await this.findOne(id, tenantId);

    const updated = await this.prisma.departments.update({
      where: { id },
      data: dto,
    });

    await this.auditService.logAction({
      tenantId,
      userId,
      action: AuditAction.UPDATE,
      tableName: 'departments',
      recordId: department.id,
      oldValues: { name: department.name, managerId: department.managerId },
      newValues: { name: updated.name, managerId: updated.managerId },
    });

    return updated;
  }

  async softDelete(id: string, tenantId: string, userId?: string) {
    const department = await this.findOne(id, tenantId);

    const deleted = await this.prisma.departments.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.auditService.logAction({
      tenantId,
      userId,
      action: AuditAction.DELETE,
      tableName: 'departments',
      recordId: department.id,
      oldValues: { name: department.name, code: department.code },
    });

    return deleted;
  }
}
