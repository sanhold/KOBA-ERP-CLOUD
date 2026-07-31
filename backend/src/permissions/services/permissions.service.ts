import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePermissionDto) {
    const existing = await this.prisma.permissions.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(`La permission avec le code '${dto.code}' existe déjà`);
    }

    return this.prisma.permissions.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.permissions.findMany({
      orderBy: [{ module: 'asc' }, { resource: 'asc' }, { action: 'asc' }],
    });
  }

  async findOne(id: string) {
    const permission = await this.prisma.permissions.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission introuvable (ID: ${id})`);
    }

    return permission;
  }
}
