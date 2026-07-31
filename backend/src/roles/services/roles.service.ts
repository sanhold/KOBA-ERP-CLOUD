import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const existing = await this.prisma.roles.findUnique({
      where: {
        tenantId_code: {
          tenantId: dto.tenantId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Le rôle avec le code '${dto.code}' existe déjà dans ce Tenant`);
    }

    return this.prisma.roles.create({
      data: dto,
    });
  }

  async findAllByTenant(tenantId: string) {
    return this.prisma.roles.findMany({
      where: {
        OR: [{ tenantId }, { isSystem: true }],
        deletedAt: null,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const role = await this.prisma.roles.findFirst({
      where: {
        id,
        OR: [{ tenantId }, { isSystem: true }],
        deletedAt: null,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Rôle introuvable (ID: ${id})`);
    }

    return role;
  }

  async update(id: string, tenantId: string, dto: UpdateRoleDto) {
    await this.findOne(id, tenantId);

    return this.prisma.roles.update({
      where: { id },
      data: dto,
    });
  }

  async assignPermissions(roleId: string, tenantId: string, dto: AssignPermissionsDto) {
    const role = await this.findOne(roleId, tenantId);

    await this.prisma.rolePermissions.deleteMany({
      where: { roleId: role.id },
    });

    const dataToInsert = dto.permissionIds.map((permissionId) => ({
      roleId: role.id,
      permissionId,
    }));

    await this.prisma.rolePermissions.createMany({
      data: dataToInsert,
    });

    return this.findOne(roleId, tenantId);
  }

  async softDelete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.roles.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
