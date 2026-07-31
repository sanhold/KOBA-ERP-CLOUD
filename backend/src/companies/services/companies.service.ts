import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { AuditAction } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(tenantId: string, dto: CreateCompanyDto, userId?: string) {
    const company = await this.prisma.companies.create({
      data: {
        tenantId,
        organizationId: dto.organizationId,
        name: dto.name,
        legalName: dto.legalName,
        legalForm: dto.legalForm,
        registrationNumber: dto.registrationNumber,
        taxId: dto.taxId,
        currency: dto.currency || 'XOF',
        countryId: dto.countryId,
      },
    });

    await this.auditService.logAction({
      tenantId,
      companyId: company.id,
      userId,
      action: AuditAction.CREATE,
      tableName: 'companies',
      recordId: company.id,
      newValues: { name: company.name, legalForm: company.legalForm, taxId: company.taxId },
    });

    return company;
  }

  async findAllByTenant(tenantId: string, search?: string) {
    const whereClause: any = { tenantId, deletedAt: null };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { legalName: { contains: search, mode: 'insensitive' } },
        { registrationNumber: { contains: search, mode: 'insensitive' } },
        { taxId: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.companies.findMany({
      where: whereClause,
      include: {
        branches: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const company = await this.prisma.companies.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        branches: true,
      },
    });

    if (!company) {
      throw new NotFoundException(`Entreprise introuvable (ID: ${id})`);
    }

    return company;
  }

  async update(id: string, tenantId: string, dto: UpdateCompanyDto, userId?: string) {
    const company = await this.findOne(id, tenantId);

    const updated = await this.prisma.companies.update({
      where: { id },
      data: dto,
    });

    await this.auditService.logAction({
      tenantId,
      companyId: company.id,
      userId,
      action: AuditAction.UPDATE,
      tableName: 'companies',
      recordId: company.id,
      oldValues: { name: company.name, taxId: company.taxId },
      newValues: { name: updated.name, taxId: updated.taxId },
    });

    return updated;
  }

  async softDelete(id: string, tenantId: string, userId?: string) {
    const company = await this.findOne(id, tenantId);

    const deleted = await this.prisma.companies.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.auditService.logAction({
      tenantId,
      companyId: company.id,
      userId,
      action: AuditAction.DELETE,
      tableName: 'companies',
      recordId: company.id,
      oldValues: { name: company.name },
    });

    return deleted;
  }
}
