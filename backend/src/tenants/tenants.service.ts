import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTenantDto) {
    const existing = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`Un tenant avec le slug '${dto.slug}' existe déjà`);
    }

    return this.prisma.tenant.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.tenant.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, deletedAt: null },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant introuvable (ID: ${id})`);
    }

    return tenant;
  }
}
