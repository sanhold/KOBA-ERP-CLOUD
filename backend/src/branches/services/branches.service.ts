import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { AuditAction } from '@prisma/client';

@Injectable()
export class BranchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(tenantId: string, dto: CreateBranchDto, userId?: string) {
    const existing = await this.prisma.branches.findUnique({
      where: {
        companyId_code: {
          companyId: dto.companyId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`La filiale avec le code '${dto.code}' existe déjà dans cette entreprise`);
    }

    const branch = await this.prisma.branches.create({
      data: {
        tenantId,
        companyId: dto.companyId,
        name: dto.name,
        code: dto.code.toUpperCase(),
        cityId: dto.cityId,
        address: dto.address,
      },
    });

    await this.auditService.logAction({
      tenantId,
      companyId: dto.companyId,
      userId,
      action: AuditAction.CREATE,
      tableName: 'branches',
      recordId: branch.id,
      newValues: { name: branch.name, code: branch.code },
    });

    return branch;
  }

  async findAllByTenant(tenantId: string) {
    return this.prisma.branches.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        departments: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const branch = await this.prisma.branches.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        departments: true,
      },
    });

    if (!branch) {
      throw new NotFoundException(`Filiale / Agence introuvable (ID: ${id})`);
    }

    return branch;
  }

  async update(id: string, tenantId: string, dto: UpdateBranchDto, userId?: string) {
    const branch = await this.findOne(id, tenantId);

    const updated = await this.prisma.branches.update({
      where: { id },
      data: dto,
    });

    await this.auditService.logAction({
      tenantId,
      companyId: branch.companyId,
      userId,
      action: AuditAction.UPDATE,
      tableName: 'branches',
      recordId: branch.id,
      oldValues: { name: branch.name },
      newValues: { name: updated.name },
    });

    return updated;
  }

  async softDelete(id: string, tenantId: string, userId?: string) {
    const branch = await this.findOne(id, tenantId);

    const deleted = await this.prisma.branches.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.auditService.logAction({
      tenantId,
      companyId: branch.companyId,
      userId,
      action: AuditAction.DELETE,
      tableName: 'branches',
      recordId: branch.id,
      oldValues: { name: branch.name, code: branch.code },
    });

    return deleted;
  }
}
