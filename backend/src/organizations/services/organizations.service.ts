import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { AuditAction } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(tenantId: string, dto: CreateOrganizationDto, userId?: string) {
    const existing = await this.prisma.organizations.findUnique({
      where: {
        tenantId_code: {
          tenantId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`L'organisation avec le code '${dto.code}' existe déjà dans ce Tenant`);
    }

    const organization = await this.prisma.organizations.create({
      data: {
        tenantId,
        name: dto.name,
        code: dto.code.toUpperCase(),
      },
    });

    await this.auditService.logAction({
      tenantId,
      userId,
      action: AuditAction.CREATE,
      tableName: 'organizations',
      recordId: organization.id,
      newValues: { name: organization.name, code: organization.code },
    });

    return organization;
  }

  async findAllByTenant(tenantId: string) {
    return this.prisma.organizations.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        companies: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const organization = await this.prisma.organizations.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        companies: true,
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organisation introuvable (ID: ${id})`);
    }

    return organization;
  }

  async update(id: string, tenantId: string, dto: UpdateOrganizationDto, userId?: string) {
    const organization = await this.findOne(id, tenantId);

    const updated = await this.prisma.organizations.update({
      where: { id },
      data: dto,
    });

    await this.auditService.logAction({
      tenantId,
      userId,
      action: AuditAction.UPDATE,
      tableName: 'organizations',
      recordId: organization.id,
      oldValues: { name: organization.name },
      newValues: { name: updated.name },
    });

    return updated;
  }

  async softDelete(id: string, tenantId: string, userId?: string) {
    const organization = await this.findOne(id, tenantId);

    const deleted = await this.prisma.organizations.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.auditService.logAction({
      tenantId,
      userId,
      action: AuditAction.DELETE,
      tableName: 'organizations',
      recordId: organization.id,
      oldValues: { name: organization.name, code: organization.code },
    });

    return deleted;
  }
}
